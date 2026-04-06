from __future__ import annotations

from ...domain.value_objects.cnpj import Cnpj
from ...ports.repositories.clinic_repository import ClinicRepository


def create_clinic(
    clinic_repo: ClinicRepository,
    name: str,
    address: str,
    hours: str,
    description: str,
    image_url: str,
    contact_phone: str,
    contact_whatsapp: str,
    contact_email: str,
    cnpj: str,
):
    normalized_cnpj = str(Cnpj(cnpj))
    return clinic_repo.create(
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
