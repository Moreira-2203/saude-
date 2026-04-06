from __future__ import annotations

from typing import Protocol

from ...domain.entities.clinic import Clinic


class ClinicRepository(Protocol):
    def list_all(self) -> list[Clinic]: ...

    def get_by_id(self, clinic_id: str) -> Clinic | None: ...

    def create(
        self,
        name: str,
        address: str,
        hours: str,
        description: str,
        image_url: str,
        contact_phone: str,
        contact_whatsapp: str,
        contact_email: str,
        cnpj: str,
    ) -> Clinic: ...

    def update(
        self,
        clinic_id: str,
        name: str | None,
        address: str | None,
        hours: str | None,
        description: str | None,
        image_url: str | None,
        contact_phone: str | None,
        contact_whatsapp: str | None,
        contact_email: str | None,
        cnpj: str | None,
    ) -> Clinic | None: ...

    def delete(self, clinic_id: str) -> bool: ...

    def delete_all(self) -> int: ...
