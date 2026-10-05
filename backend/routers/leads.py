"""Lead capture endpoints — one collection, three sources (apply / counselling / contact)."""

import os
import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Header, HTTPException

from lib.db import db
from models.leads import Lead, LeadCreate

router = APIRouter()


def _aware(doc: dict) -> dict:
    """Motor returns naive datetimes — normalise to aware UTC so Pydantic serialises the offset."""
    created = doc.get("created_at")
    if isinstance(created, datetime) and created.tzinfo is None:
        doc["created_at"] = created.replace(tzinfo=timezone.utc)
    return doc


@router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@router.post("/enquiries", response_model=Lead, status_code=201)
async def create_enquiry(input: LeadCreate):
    data = input.model_dump()
    data["source"] = "contact"  # contact-form submissions are always tagged as enquiries
    lead = Lead(**data)
    await db.leads.insert_one(lead.model_dump())
    return lead


@router.get("/leads", response_model=List[Lead])
async def list_leads(x_admin_key: str | None = Header(default=None)):
    expected = os.environ.get("ADMIN_KEY", "")
    if not expected or x_admin_key != expected:
        raise HTTPException(status_code=401, detail="admin key required")
    docs = await db.leads.find().sort("created_at", -1).to_list(500)
    return [Lead(**_aware(doc)) for doc in docs]
