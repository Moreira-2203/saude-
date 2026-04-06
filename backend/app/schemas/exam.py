from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class ExamOut(BaseModel):
    id: str
    patient_id: str
    name: str
    lab: str
    file_url: str
    created_at: datetime
