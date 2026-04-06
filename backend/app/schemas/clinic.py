from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class ClinicCreate(BaseModel):
    name: str
    address: str
    hours: str
    description: str
    image_url: str
    contact_phone: str
    contact_whatsapp: str
    contact_email: str
    cnpj: str


class ClinicUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    hours: str | None = None
    description: str | None = None
    image_url: str | None = None
    contact_phone: str | None = None
    contact_whatsapp: str | None = None
    contact_email: str | None = None
    cnpj: str | None = None


class ClinicOut(BaseModel):
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
