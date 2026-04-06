from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    clinic_id: str
    doctor_name: str
    specialty: str
    date: str
    time: str
    status: str


class AppointmentUpdate(BaseModel):
    date: str | None = None
    time: str | None = None
    status: str


class AppointmentOut(BaseModel):
    id: str
    clinic_id: str
    patient_id: str
    doctor_name: str
    specialty: str
    date: str
    time: str
    status: str
    created_at: datetime
