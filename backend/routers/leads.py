"""Lead capture endpoints — one collection, three sources (apply / counselling / contact)."""

import asyncio
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter

from lib.db import db
from lib.email import notify_owner_of_lead, send_student_ack
from models.leads import Lead, LeadCreate

router = APIRouter()


def _aware(doc: dict) -> dict:
    """Motor returns naive datetimes — normalise to aware UTC so Pydantic serialises the offset."""
    created = doc.get("created_at")
    if isinstance(created, datetime) and created.tzinfo is None:
        doc["created_at"] = created.replace(tzinfo=timezone.utc)
    return doc


async def _save_and_notify(data: dict) -> Lead:
    lead = Lead(**data)
    doc = lead.model_dump()
    await db.leads.insert_one(doc)
    # Emails run in the background: a slow or failing mail provider must never
    # delay or break the student's submission.
    asyncio.create_task(notify_owner_of_lead(doc))
    asyncio.create_task(send_student_ack(doc))
    return lead


@router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(input: LeadCreate):
    return await _save_and_notify(input.model_dump())


@router.post("/enquiries", response_model=Lead, status_code=201)
async def create_enquiry(input: LeadCreate):
    data = input.model_dump()
    data["source"] = "contact"  # contact-form submissions are always tagged as enquiries
    return await _save_and_notify(data)
