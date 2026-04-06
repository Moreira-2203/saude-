from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str
    password_hash: str
    role: str
    created_at: datetime
