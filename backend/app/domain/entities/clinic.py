from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Clinic:
    id: str
    name: str
    address: str
    hours: str
    description: str
    image_url: str
    contact_phone: str
    contact_whatsapp: str
    contact_email: str
    cnpj: str
    created_at: datetime
