"""Catalog models: courses and colleges surfaced on the site."""

import uuid
from typing import List

from pydantic import BaseModel, Field


class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # e.g. "Engineering & Technology"
    level: str  # Undergraduate | Postgraduate | Diploma
    duration: str  # e.g. "4 Years"
    eligibility: str
    fee_range: str  # indicative total course fee, e.g. "₹3 – 6 Lakh (total)"
    description: str
    career_outcomes: List[str] = Field(default_factory=list)
    popular: bool = False


class College(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    city: str
    state: str
    type: str  # Government | Private | Private (Deemed)
    streams: List[str] = Field(default_factory=list)
    rating: float = 4.0
    fee_range: str
    description: str
    featured: bool = False
