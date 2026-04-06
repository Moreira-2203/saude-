from __future__ import annotations

from sqlalchemy.orm import Session

from ....domain.entities.appointment import Appointment
from ...persistence.models import AppointmentModel


class AppointmentRepositorySql:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list_by_patient(self, patient_id: str) -> list[Appointment]:
        models = (
            self._db.query(AppointmentModel)
            .filter(AppointmentModel.patient_id == patient_id)
            .order_by(AppointmentModel.created_at.desc())
            .all()
        )
        return [_to_entity(m) for m in models]

    def get_by_id(self, appointment_id: str) -> Appointment | None:
        model = (
            self._db.query(AppointmentModel)
            .filter(AppointmentModel.id == appointment_id)
            .first()
        )
        return _to_entity(model) if model else None

    def create(
        self,
        clinic_id: str,
        patient_id: str,
        doctor_name: str,
        specialty: str,
        date: str,
        time: str,
        status: str,
    ) -> Appointment:
        model = AppointmentModel(
            clinic_id=clinic_id,
            patient_id=patient_id,
            doctor_name=doctor_name,
            specialty=specialty,
            date=date,
            time=time,
            status=status,
        )
        self._db.add(model)
        self._db.commit()
        self._db.refresh(model)
        return _to_entity(model)

    def update(
        self,
        appointment_id: str,
        patient_id: str,
        date: str | None,
        time: str | None,
        status: str,
    ) -> Appointment | None:
        model = (
            self._db.query(AppointmentModel)
            .filter(
                AppointmentModel.id == appointment_id,
                AppointmentModel.patient_id == patient_id,
            )
            .first()
        )
        if not model:
            return None
        if date:
            model.date = date
        if time:
            model.time = time
        model.status = status
        self._db.commit()
        self._db.refresh(model)
        return _to_entity(model)


def _to_entity(model: AppointmentModel) -> Appointment:
    return Appointment(
        id=model.id,
        clinic_id=model.clinic_id,
        patient_id=model.patient_id,
        doctor_name=model.doctor_name,
        specialty=model.specialty,
        date=model.date,
        time=model.time,
        status=model.status,
        created_at=model.created_at,
    )
