from __future__ import annotations

from typing import Protocol

from ...domain.entities.appointment import Appointment


class AppointmentRepository(Protocol):
    def list_by_patient(self, patient_id: str) -> list[Appointment]: ...

    def get_by_id(self, appointment_id: str) -> Appointment | None: ...

    def create(
        self,
        clinic_id: str,
        patient_id: str,
        doctor_name: str,
        specialty: str,
        date: str,
        time: str,
        status: str,
    ) -> Appointment: ...

    def update(
        self,
        appointment_id: str,
        patient_id: str,
        date: str | None,
        time: str | None,
        status: str,
    ) -> Appointment | None: ...
