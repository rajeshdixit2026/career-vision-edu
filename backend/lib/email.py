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
