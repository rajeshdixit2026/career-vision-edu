"""Platform cron webhooks. Auth is a bearer token compared in constant time."""

import asyncio
import hmac
import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Header, HTTPException, Request

from lib.db import db
from lib.email import send_daily_summary

router = APIRouter(prefix="/cron")
logger = logging.getLogger(__name__)

IST = ZoneInfo("Asia/Kolkata")

# Run ids already handled, so a duplicate delivery is acked without resending email.
_seen_runs: set[str] = set()


def _require_cron_auth(authorization: str | None) -> None:
    secret = os.environ.get("WEBHOOK_CRON_SECRET", "")
    if not secret:
        raise HTTPException(status_code=401, detail="cron secret not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    if not hmac.compare_digest(token, secret):
        raise HTTPException(status_code=401, detail="invalid cron token")


async def _run_daily_summary() -> None:
    """Collect the last 24h of enquiries (IST) and email the owner. Skips empty days."""
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    docs = await db.leads.find({"created_at": {"$gte": since}}).sort("created_at", -1).to_list(500)
    if not docs:
        logger.info("daily summary skipped: no new enquiries in the last 24h")
        return
    day_label = datetime.now(IST).strftime("%d %b %Y") + " · last 24 hours"
    await send_daily_summary(docs, day_label)


@router.post("/daily-summary")
async def daily_summary(
    request: Request,
    authorization: str | None = Header(default=None),
    x_webhook_id: str | None = Header(default=None),
):
    # Cron endpoints must ack 2xx immediately; enqueue/background the actual work.
    _require_cron_auth(authorization)

    envelope: dict[str, Any] = {}
    try:
        if await request.body():
            envelope = await request.json()
    except Exception:  # noqa: BLE001 — a malformed body is a client error, not a crash
        raise HTTPException(status_code=400, detail="invalid JSON body")

    run_id = x_webhook_id or str(envelope.get("run_id") or "")
    if run_id and run_id in _seen_runs:
        return {"status": "duplicate", "run_id": run_id}
    if run_id:
        _seen_runs.add(run_id)

    asyncio.create_task(_run_daily_summary())
    return {"status": "accepted", "run_id": run_id}
