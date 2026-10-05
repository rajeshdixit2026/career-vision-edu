"""Lead models: admission enquiries captured from Apply / Counselling / Contact forms."""

import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from lib.db import db  # noqa: F401  (re-export keeps routers one-import away)

VALID_SOURCES = {"apply", "counselling", "contact"}
VALID_STATUSES = {"new", "called", "interested", "admitted", "not_interested"}


def _normalise_phone(raw: str) -> str:
    digits = "".join(ch for ch in raw if ch.isdigit())
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    elif digits.startswith("0") and len(digits) == 11:
        digits = digits[1:]
    return digits


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str
    email: Optional[str] = None
    course_interest: Optional[str] = None
    state: Optional[str] = None
    message: Optional[str] = None
    source: str = "apply"  # apply | counselling | contact

    @field_validator("phone")
    @classmethod
    def phone_must_be_indian_mobile(cls, v: str) -> str:
        digits = _normalise_phone(v)
        if len(digits) != 10 or digits[0] not in "6789":
            raise ValueError("enter a valid 10-digit Indian mobile number")
        return digits

    @field_validator("source")
    @classmethod
    def source_allowed(cls, v: str) -> str:
        if v not in VALID_SOURCES:
            raise ValueError("invalid lead source")
        return v

    @field_validator("email")
    @classmethod
    def email_ok(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v.strip() == "":
            return None
        v = v.strip()
        if "@" not in v or "." not in v.split("@")[-1] or " " in v:
            raise ValueError("enter a valid email address")
        return v


class LeadNote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str = Field(min_length=1, max_length=2000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadNoteCreate(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"
    notes: List[LeadNote] = Field(default_factory=list)
    # Derived at read time: an uncalled enquiry older than the follow-up window.
    overdue: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def status_allowed(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(f"status must be one of: {', '.join(sorted(VALID_STATUSES))}")
        return v
