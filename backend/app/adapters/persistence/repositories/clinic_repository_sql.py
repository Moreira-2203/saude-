from __future__ import annotations

from sqlalchemy.orm import Session

from ....domain.entities.clinic import Clinic
from ...persistence.models import ClinicModel


class ClinicRepositorySql:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list_all(self) -> list[Clinic]:
        models = self._db.query(ClinicModel).order_by(ClinicModel.name.asc()).all()
        return [_to_entity(m) for m in models]

    def get_by_id(self, clinic_id: str) -> Clinic | None:
        model = self._db.query(ClinicModel).filter(ClinicModel.id == clinic_id).first()
        return _to_entity(model) if model else None

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
    ) -> Clinic:
        model = ClinicModel(
            name=name,
            address=address,
            hours=hours,
            description=description,
            image_url=image_url,
            contact_phone=contact_phone,
            contact_whatsapp=contact_whatsapp,
            contact_email=contact_email,
            cnpj=cnpj,
        )
        self._db.add(model)
        self._db.commit()
        self._db.refresh(model)
        return _to_entity(model)

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
    ) -> Clinic | None:
        model = (
            self._db.query(ClinicModel)
            .filter(ClinicModel.id == clinic_id)
            .first()
        )
        if not model:
            return None
        if name:
            model.name = name
        if address:
            model.address = address
        if hours:
            model.hours = hours
        if description:
            model.description = description
        if image_url:
            model.image_url = image_url
        if contact_phone:
            model.contact_phone = contact_phone
        if contact_whatsapp:
            model.contact_whatsapp = contact_whatsapp
        if contact_email:
            model.contact_email = contact_email
        if cnpj:
            model.cnpj = cnpj
        self._db.commit()
        self._db.refresh(model)
        return _to_entity(model)

    def delete(self, clinic_id: str) -> bool:
        result = (
            self._db.query(ClinicModel)
            .filter(ClinicModel.id == clinic_id)
            .delete()
        )
        self._db.commit()
        return result > 0

    def delete_all(self) -> int:
        result = self._db.query(ClinicModel).delete()
        self._db.commit()
        return result


def _to_entity(model: ClinicModel) -> Clinic:
    return Clinic(
        id=model.id,
        name=model.name,
        address=model.address,
        hours=model.hours,
        description=model.description,
        image_url=model.image_url,
        contact_phone=model.contact_phone,
        contact_whatsapp=model.contact_whatsapp,
        contact_email=model.contact_email,
        cnpj=model.cnpj,
        created_at=model.created_at,
    )
