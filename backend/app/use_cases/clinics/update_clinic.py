from __future__ import annotations

from ...domain.value_objects.cnpj import Cnpj
from ...ports.repositories.clinic_repository import ClinicRepository


def update_clinic(
    clinic_repo: ClinicRepository,
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
):
    normalized_cnpj = str(Cnpj(cnpj)) if cnpj else None
    return clinic_repo.update(
        clinic_id=clinic_id,
        name=name,
        address=address,
        hours=hours,
        description=description,
        image_url=image_url,
        contact_phone=contact_phone,
        contact_whatsapp=contact_whatsapp,
        contact_email=contact_email,
        cnpj=normalized_cnpj,
    )
