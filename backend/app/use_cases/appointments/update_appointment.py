from __future__ import annotations

from ...ports.repositories.appointment_repository import AppointmentRepository

ALLOWED_STATUS = {"agendado", "cancelado", "remarcado"}


def update_appointment(
    appointment_repo: AppointmentRepository,
    appointment_id: str,
    patient_id: str,
    date: str | None,
    time: str | None,
    status: str,
):
    if status not in ALLOWED_STATUS:
        raise ValueError("Invalid status")

    if status == "remarcado" and (not date or not time):
        raise ValueError("Date and time required to reschedule")

    appointment = appointment_repo.update(
        appointment_id=appointment_id,
        patient_id=patient_id,
        date=date,
        time=time,
        status=status,
    )
    if not appointment:
        raise ValueError("Appointment not found")
    return appointment
