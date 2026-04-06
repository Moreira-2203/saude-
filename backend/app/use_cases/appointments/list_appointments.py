from __future__ import annotations

from ...ports.repositories.appointment_repository import AppointmentRepository


def list_appointments(appointment_repo: AppointmentRepository, patient_id: str):
    return appointment_repo.list_by_patient(patient_id)
