from __future__ import annotations

from ...ports.repositories.appointment_repository import AppointmentRepository

ALLOWED_STATUS = {"agendado", "cancelado", "remarcado"}


def create_appointment(
    appointment_repo: AppointmentRepository,
    clinic_id: str,
    patient_id: str,
    doctor_name: str,
    specialty: str,
    date: str,
    time: str,
    status: str,
):
    if status not in ALLOWED_STATUS:
        raise ValueError("Invalid status")
    return appointment_repo.create(
        clinic_id=clinic_id,
        patient_id=patient_id,
        doctor_name=doctor_name,
        specialty=specialty,
        date=date,
        time=time,
        status=status,
    )
