from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Exam:
    id: str
    patient_id: str
    name: str
    lab: str
    file_url: str
    created_at: datetime
