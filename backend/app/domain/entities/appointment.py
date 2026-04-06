from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Appointment:
    id: str
    clinic_id: str
    patient_id: str
    doctor_name: str
    specialty: str
    date: str
    time: str
    status: str
    created_at: datetime
