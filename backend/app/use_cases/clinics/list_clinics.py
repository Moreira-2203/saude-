from __future__ import annotations

from ...ports.repositories.clinic_repository import ClinicRepository


def list_clinics(clinic_repo: ClinicRepository):
    return clinic_repo.list_all()
