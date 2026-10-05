"""Emergent managed email (Resend) — owner alerts on new enquiries.

Guardrails: recipients come from OWNER_EMAIL (server config, never caller input),
bodies are built from the server-side template in this module only.
"""

import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

logger = logging.getLogger(__name__)

# Emergent managed email proxy. Constant on purpose — an env var would go missing in deploys.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Career Vision Education Services")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "")
# Dashboard deep-link used in the daily summary. Must stay an https URL on our own app (G3).
ADMIN_DASHBOARD_URL = (
    os.environ.get("APP_URL", "https://career-vision-edu.preview.emergentagent.com").rstrip("/")
    + "/admin"
)

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = (
    "reply with your password", "reply with the code", "send your password", "cvv",
    "send us your password", "enter your password below", "confirm your card number",
    "your full card number", "seed phrase", "recovery phrase", "verify your card",
    "social security number", "confirm your bank details",
)
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    """Structural guardrail gate — never weaken, wrap in try/except, or remove."""
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)  # G2-G3 gate — never skip
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


SOURCE_LABELS = {
    "apply": "Admission Application",
    "counselling": "Free Counselling Request",
    "contact": "Website Enquiry",
}


def _row(label: str, value: str) -> str:
    return (
        '<tr>'
        f'<td style="padding:6px 0;font-size:13px;color:#64748B;width:150px">{escape(label)}</td>'
        f'<td style="padding:6px 0;font-size:14px;color:#0F172A;font-weight:600">{escape(value)}</td>'
        "</tr>"
    )


def build_lead_alert(lead: dict) -> tuple[str, str]:
    """Server-side template for the owner alert. Returns (subject, html)."""
    label = SOURCE_LABELS.get(str(lead.get("source", "")), "New Enquiry")
    name = str(lead.get("name") or "Unknown")
    phone = str(lead.get("phone") or "-")
    subject = f"New {label}: {name} ({phone})"

    rows = _row("Name", name) + _row("Mobile", phone)
    if lead.get("email"):
        rows += _row("Email", str(lead["email"]))
    if lead.get("course_interest"):
        rows += _row("Course Interest", str(lead["course_interest"]))
    if lead.get("state"):
        rows += _row("State", str(lead["state"]))
    rows += _row("Request Type", label)

    message_block = ""
    if lead.get("message"):
        message_block = (
            '<p style="margin:18px 0 6px;font-size:13px;color:#64748B">Message from student</p>'
            '<p style="margin:0;padding:12px 14px;background:#F8FAFC;border-left:3px solid #FFCD2A;'
            f'font-size:14px;color:#0F172A;line-height:1.6">{escape(str(lead["message"]))}</p>'
        )

    html = (
        '<table role="presentation" width="100%" style="background:#F8FAFC;padding:24px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="100%" style="max-width:560px;background:#FFFFFF;'
        'border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td style="background:#04194E;padding:20px 24px">'
        '<p style="margin:0;font-size:12px;letter-spacing:2px;color:#FFCD2A;font-weight:bold">'
        'CAREER VISION EDUCATION SERVICES</p>'
        f'<p style="margin:6px 0 0;font-size:19px;color:#FFFFFF;font-weight:bold">{escape(label)}</p>'
        "</td></tr>"
        '<tr><td style="padding:24px">'
        '<p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6">'
        "A student just submitted the form on your website. Their details are below — "
        "call them back within 24 hours.</p>"
        f'<table role="presentation" width="100%">{rows}</table>'
        f"{message_block}"
        f'<p style="margin:22px 0 0"><a href="tel:{escape(phone)}" '
        'style="display:inline-block;background:#FFCD2A;color:#04194E;text-decoration:none;'
        'padding:11px 22px;border-radius:999px;font-size:14px;font-weight:bold">'
        "Call this student</a></p>"
        "</td></tr>"
        '<tr><td style="padding:16px 24px;background:#F8FAFC">'
        '<p style="margin:0;font-size:11px;color:#94A3B8;line-height:1.6">'
        f"Automated alert sent by {escape(EMAIL_FROM_NAME)} when a website form is submitted. "
        "We never ask you for passwords or payment details by email.</p>"
        "</td></tr></table></td></tr></table>"
    )
    return subject, html


async def notify_owner_of_lead(lead: dict) -> None:
    """Fire-and-forget owner alert. Never raises — lead capture must not fail on email."""
    if not EMAIL_KEY or not OWNER_EMAIL:
        logger.warning("notify_owner_of_lead skipped: EMERGENT_EMAIL_KEY or OWNER_EMAIL unset")
        return
    try:
        subject, html = build_lead_alert(lead)
        email_id = await send_email(to=OWNER_EMAIL, subject=subject, html=html)
        logger.info("lead alert sent (%s) for lead %s", email_id, lead.get("id"))
    except httpx.HTTPStatusError as exc:
        logger.error("lead alert failed: %s %s", exc.response.status_code, exc.response.text)
    except Exception as exc:  # noqa: BLE001 — alerting must never break the API
        logger.error("lead alert error: %s", exc)


def build_student_ack(lead: dict) -> tuple[str, str]:
    """Thank-you confirmation sent to the student. Copy supplied by the business owner."""
    subject = "Thank You for Contacting Career Vision Education Services!"
    name = str(lead.get("name") or "Student")
    html = (
        '<table role="presentation" width="100%" style="background:#F8FAFC;padding:24px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="100%" style="max-width:560px;background:#FFFFFF;'
        'border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td style="background:#04194E;padding:22px 24px">'
        '<p style="margin:0;font-size:12px;letter-spacing:2px;color:#FFCD2A;font-weight:bold">'
        'CAREER VISION EDUCATION SERVICES</p>'
        '<p style="margin:8px 0 0;font-size:20px;color:#FFFFFF;font-weight:bold">'
        '&#127891; Thank You for Contacting Us!</p>'
        "</td></tr>"
        '<tr><td style="padding:26px 24px">'
        f'<p style="margin:0 0 14px;font-size:15px;color:#0F172A">Dear {escape(name)},</p>'
        '<p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.7">'
        "Thank you for submitting your enquiry with Career Vision Education Services.</p>"
        '<table role="presentation" width="100%" style="margin:0 0 16px">'
        '<tr><td style="padding:12px 14px;background:#F8FAFC;border-left:3px solid #16A34A;'
        'font-size:14px;color:#0F172A;line-height:1.7">'
        "&#9989; We have successfully received your details.<br>"
        "&#128222; Our counselling team will review your enquiry and contact you shortly "
        "to assist you with the next steps.</td></tr></table>"
        '<p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.7">'
        "We appreciate your interest in Career Vision Education Services and look forward to "
        "helping you make the right decision for your education and career.</p>"
        '<p style="margin:22px 0 0;font-size:14px;color:#0F172A;line-height:1.7">Regards,<br>'
        '<strong>Career Vision Education Services</strong><br>'
        '<span style="color:#92400E;font-style:italic">Your Career, Our Vision.</span></p>'
        "</td></tr>"
        '<tr><td style="padding:16px 24px;background:#F8FAFC">'
        '<p style="margin:0;font-size:11px;color:#94A3B8;line-height:1.6">'
        f"Sent by {escape(EMAIL_FROM_NAME)}, Gopalganj, Bihar. "
        "We never ask for passwords or payment details by email.</p>"
        "</td></tr></table></td></tr></table>"
    )
    return subject, html


async def send_student_ack(lead: dict) -> None:
    """Thank-you email to the student. Skipped silently when they left no email address."""
    student_email = lead.get("email")
    if not EMAIL_KEY or not student_email:
        return
    try:
        subject, html = build_student_ack(lead)
        email_id = await send_email(to=str(student_email), subject=subject, html=html)
        logger.info("student ack sent (%s) for lead %s", email_id, lead.get("id"))
    except httpx.HTTPStatusError as exc:
        logger.error("student ack failed: %s %s", exc.response.status_code, exc.response.text)
    except Exception as exc:  # noqa: BLE001 — never break lead capture
        logger.error("student ack error: %s", exc)


def build_daily_summary(
    leads: list[dict], day_label: str, overdue_count: int = 0
) -> tuple[str, str]:
    """Owner's morning digest of the enquiries received in the reporting window."""
    count = len(leads)
    subject = f"Daily Summary: {count} new enquir{'y' if count == 1 else 'ies'} ({day_label})"
    if overdue_count:
        subject += f" · {overdue_count} need follow-up"

    rows = ""
    for lead in leads:
        label = SOURCE_LABELS.get(str(lead.get("source", "")), "Enquiry")
        course = str(lead.get("course_interest") or "—")
        rows += (
            '<tr>'
            '<td style="padding:10px 8px;border-top:1px solid #E2E8F0;font-size:13px;'
            f'color:#0F172A;font-weight:600">{escape(str(lead.get("name") or "Unknown"))}</td>'
            '<td style="padding:10px 8px;border-top:1px solid #E2E8F0;font-size:13px;'
            f'color:#0F172A">{escape(str(lead.get("phone") or "-"))}</td>'
            '<td style="padding:10px 8px;border-top:1px solid #E2E8F0;font-size:12px;'
            f'color:#64748B">{escape(course)}</td>'
            '<td style="padding:10px 8px;border-top:1px solid #E2E8F0;font-size:12px;'
            f'color:#64748B">{escape(label)}</td>'
            "</tr>"
        )

    overdue_block = ""
    if overdue_count:
        overdue_block = (
            '<table role="presentation" width="100%" style="margin:0 0 18px">'
            '<tr><td style="padding:12px 14px;background:#FEF3C7;border-left:3px solid #FFCD2A;'
            'font-size:14px;color:#78350F;line-height:1.6">'
            f"<strong>{overdue_count} enquir{'y' if overdue_count == 1 else 'ies'}</strong> "
            "still marked New after 2+ days. Please call them today so nobody slips through."
            "</td></tr></table>"
        )

    html = (
        '<table role="presentation" width="100%" style="background:#F8FAFC;padding:24px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="100%" style="max-width:620px;background:#FFFFFF;'
        'border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td style="background:#04194E;padding:20px 24px">'
        '<p style="margin:0;font-size:12px;letter-spacing:2px;color:#FFCD2A;font-weight:bold">'
        'CAREER VISION EDUCATION SERVICES</p>'
        '<p style="margin:6px 0 0;font-size:19px;color:#FFFFFF;font-weight:bold">'
        'Daily Enquiry Summary</p>'
        f'<p style="margin:4px 0 0;font-size:13px;color:#CBD5E1">{escape(day_label)}</p>'
        "</td></tr>"
        '<tr><td style="padding:24px">'
        '<p style="margin:0 0 18px;font-size:15px;color:#0F172A">'
        f"You received <strong>{count}</strong> new enquir{'y' if count == 1 else 'ies'}. "
        "Call them back today so nobody slips through.</p>"
        f"{overdue_block}"
        '<table role="presentation" width="100%" style="border-collapse:collapse">'
        '<tr>'
        '<th align="left" style="padding:0 8px 8px;font-size:11px;color:#64748B;'
        'text-transform:uppercase;letter-spacing:1px">Student</th>'
        '<th align="left" style="padding:0 8px 8px;font-size:11px;color:#64748B;'
        'text-transform:uppercase;letter-spacing:1px">Mobile</th>'
        '<th align="left" style="padding:0 8px 8px;font-size:11px;color:#64748B;'
        'text-transform:uppercase;letter-spacing:1px">Course</th>'
        '<th align="left" style="padding:0 8px 8px;font-size:11px;color:#64748B;'
        'text-transform:uppercase;letter-spacing:1px">Type</th>'
        "</tr>"
        f"{rows}"
        "</table>"
        f'<p style="margin:24px 0 0"><a href="{escape(ADMIN_DASHBOARD_URL)}" '
        'style="display:inline-block;background:#FFCD2A;color:#04194E;text-decoration:none;'
        'padding:11px 22px;border-radius:999px;font-size:14px;font-weight:bold">'
        "Open your dashboard</a></p>"
        "</td></tr>"
        '<tr><td style="padding:16px 24px;background:#F8FAFC">'
        '<p style="margin:0;font-size:11px;color:#94A3B8;line-height:1.6">'
        f"Automated daily summary from {escape(EMAIL_FROM_NAME)}. "
        "We never ask you for passwords or payment details by email.</p>"
        "</td></tr></table></td></tr></table>"
    )
    return subject, html


async def send_daily_summary(
    leads: list[dict], day_label: str, overdue_count: int = 0
) -> None:
    """Owner digest. Caller decides whether to skip an empty day."""
    if not EMAIL_KEY or not OWNER_EMAIL:
        logger.warning("send_daily_summary skipped: EMERGENT_EMAIL_KEY or OWNER_EMAIL unset")
        return
    try:
        subject, html = build_daily_summary(leads, day_label, overdue_count)
        email_id = await send_email(to=OWNER_EMAIL, subject=subject, html=html)
        logger.info(
            "daily summary sent (%s) covering %d leads, %d overdue",
            email_id,
            len(leads),
            overdue_count,
        )
    except httpx.HTTPStatusError as exc:
        logger.error("daily summary failed: %s %s", exc.response.status_code, exc.response.text)
    except Exception as exc:  # noqa: BLE001
        logger.error("daily summary error: %s", exc)
