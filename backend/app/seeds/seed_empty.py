from __future__ import annotations

from ..core.db import SessionLocal
from ..adapters.persistence.models import (
    AppointmentModel,
    ClinicModel,
    ExamModel,
    SessionModel,
    UserModel,
)


def seed_empty() -> None:
    db = SessionLocal()
    try:
        db.query(SessionModel).delete()
        db.query(ExamModel).delete()
        db.query(AppointmentModel).delete()
        db.query(ClinicModel).delete()
        db.query(UserModel).delete()
        db.commit()
    finally:
        db.close()
