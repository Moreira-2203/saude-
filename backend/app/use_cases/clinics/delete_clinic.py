from __future__ import annotations

from ...ports.repositories.clinic_repository import ClinicRepository


def delete_clinic(clinic_repo: ClinicRepository, clinic_id: str) -> bool:
    return clinic_repo.delete(clinic_id)
