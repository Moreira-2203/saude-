from __future__ import annotations

from ...ports.repositories.clinic_repository import ClinicRepository


def delete_all_clinics(clinic_repo: ClinicRepository) -> int:
    return clinic_repo.delete_all()
