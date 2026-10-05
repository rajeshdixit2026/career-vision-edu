"""Admin area: PIN login (httpOnly cookie session) + the enquiries list.

The PIN lives in backend/.env as ADMIN_PIN and never leaves the server. The cookie
carries an HMAC token derived from it — no token is ever returned in JSON.
"""

import hashlib
import hmac
import logging
import os
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Cookie, HTTPException, Response
from pydantic import BaseModel, Field

from lib.db import db
from models.leads import Lead

router = APIRouter(prefix="/admin")
logger = logging.getLogger(__name__)

SESSION_COOKIE = "cv_admin_session"


class AdminLoginRequest(BaseModel):
    pin: str = Field(min_length=1, max_length=128)


class AdminSession(BaseModel):
    authenticated: bool


class LeadStats(BaseModel):
    total: int
    apply: int
    counselling: int
    contact: int
    last_7_days: int


class AdminLeadsResponse(BaseModel):
    stats: LeadStats
    leads: List[Lead]


def _expected_token() -> str:
    """Stable session token derived from the configured PIN."""
    pin = os.environ.get("ADMIN_PIN", "")
    if not pin:
        return ""
    return hmac.new(pin.encode(), b"career-vision-admin", hashlib.sha256).hexdigest()


def _require_admin(session: str | None) -> None:
    expected = _expected_token()
    if not expected or not session or not hmac.compare_digest(session, expected):
        raise HTTPException(status_code=401, detail="Admin login required")


def _aware(doc: dict) -> dict:
    """Motor hands back naive datetimes; normalise to aware UTC before serialising."""
    created = doc.get("created_at")
    if isinstance(created, datetime) and created.tzinfo is None:
        doc["created_at"] = created.replace(tzinfo=timezone.utc)
    return doc


@router.post("/login", response_model=AdminSession)
async def admin_login(input: AdminLoginRequest, response: Response):
    expected = _expected_token()
    configured_pin = os.environ.get("ADMIN_PIN", "")
    if not configured_pin:
        raise HTTPException(status_code=500, detail="Admin PIN is not configured")
    if not hmac.compare_digest(input.pin.strip(), configured_pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    response.set_cookie(
        key=SESSION_COOKIE,
        value=expected,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * 60 * 12,
        path="/",
    )
    return AdminSession(authenticated=True)


@router.post("/logout", response_model=AdminSession)
async def admin_logout(response: Response):
    response.delete_cookie(SESSION_COOKIE, path="/")
    return AdminSession(authenticated=False)


@router.get("/me", response_model=AdminSession)
async def admin_me(cv_admin_session: str | None = Cookie(default=None)):
    try:
        _require_admin(cv_admin_session)
    except HTTPException:
        return AdminSession(authenticated=False)
    return AdminSession(authenticated=True)


@router.get("/leads", response_model=AdminLeadsResponse)
async def admin_leads(cv_admin_session: str | None = Cookie(default=None)):
    _require_admin(cv_admin_session)
    docs = await db.leads.find().sort("created_at", -1).to_list(1000)
    leads = [Lead(**_aware(doc)) for doc in docs]

    now = datetime.now(timezone.utc)
    recent = sum(1 for lead in leads if (now - lead.created_at).days < 7)
    stats = LeadStats(
        total=len(leads),
        apply=sum(1 for lead in leads if lead.source == "apply"),
        counselling=sum(1 for lead in leads if lead.source == "counselling"),
        contact=sum(1 for lead in leads if lead.source == "contact"),
        last_7_days=recent,
    )
    return AdminLeadsResponse(stats=stats, leads=leads)
