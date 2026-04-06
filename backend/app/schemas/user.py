from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: datetime
