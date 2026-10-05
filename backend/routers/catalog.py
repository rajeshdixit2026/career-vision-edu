"""Public catalog endpoints: course and college directories."""

from typing import List

from fastapi import APIRouter

from lib.db import db
from models.catalog import College, Course

router = APIRouter()


@router.get("/courses", response_model=List[Course])
async def list_courses(category: str | None = None):
    query: dict = {}
    if category and category.strip():
        query["category"] = category.strip()
    docs = await db.courses.find(query).sort([("popular", -1), ("name", 1)]).to_list(500)
    return [Course(**doc) for doc in docs]


@router.get("/colleges", response_model=List[College])
async def list_colleges(search: str | None = None, state: str | None = None, stream: str | None = None):
    query: dict = {}
    if state and state.strip():
        query["state"] = state.strip()
    if stream and stream.strip():
        query["streams"] = stream.strip()
    if search and search.strip():
        query["name"] = {"$regex": search.strip(), "$options": "i"}
    docs = await db.colleges.find(query).sort([("featured", -1), ("rating", -1), ("name", 1)]).to_list(500)
    return [College(**doc) for doc in docs]
