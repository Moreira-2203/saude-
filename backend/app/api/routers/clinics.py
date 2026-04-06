from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...adapters.persistence.repositories.clinic_repository_sql import ClinicRepositorySql
from ...core.db import get_db
from ...schemas.clinic import ClinicCreate, ClinicOut, ClinicUpdate
from ...use_cases.clinics.create_clinic import create_clinic
from ...use_cases.clinics.delete_all_clinics import delete_all_clinics
from ...use_cases.clinics.delete_clinic import delete_clinic
from ...use_cases.clinics.list_clinics import list_clinics
from ...use_cases.clinics.update_clinic import update_clinic
from ..deps import get_current_user

router = APIRouter(tags=["clinics"])


@router.get("/clinics", response_model=list[ClinicOut])
def list_all(db: Session = Depends(get_db)):
    clinic_repo = ClinicRepositorySql(db)
    return [
        ClinicOut(
            id=c.id,
            name=c.name,
            address=c.address,
            hours=c.hours,
            description=c.description,
            image_url=c.image_url,
            contact_phone=c.contact_phone,
            contact_whatsapp=c.contact_whatsapp,
            contact_email=c.contact_email,
            cnpj=c.cnpj,
            created_at=c.created_at,
        )
        for c in list_clinics(clinic_repo)
    ]


@router.post("/clinics", response_model=ClinicOut)
def create(payload: ClinicCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in {"admin", "recepcionista"}:
        raise HTTPException(status_code=403, detail="Not allowed")

    clinic_repo = ClinicRepositorySql(db)
    try:
        clinic = create_clinic(clinic_repo=clinic_repo, **payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return ClinicOut(
        id=clinic.id,
        name=clinic.name,
        address=clinic.address,
        hours=clinic.hours,
        description=clinic.description,
        image_url=clinic.image_url,
        contact_phone=clinic.contact_phone,
        contact_whatsapp=clinic.contact_whatsapp,
        contact_email=clinic.contact_email,
        cnpj=clinic.cnpj,
        created_at=clinic.created_at,
    )


@router.patch("/clinics/{clinic_id}", response_model=ClinicOut)
def update(
    clinic_id: str,
    payload: ClinicUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role not in {"admin", "recepcionista"}:
        raise HTTPException(status_code=403, detail="Not allowed")

    clinic_repo = ClinicRepositorySql(db)
    try:
        clinic = update_clinic(clinic_repo=clinic_repo, clinic_id=clinic_id, **payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    return ClinicOut(
        id=clinic.id,
        name=clinic.name,
        address=clinic.address,
        hours=clinic.hours,
        description=clinic.description,
        image_url=clinic.image_url,
        contact_phone=clinic.contact_phone,
        contact_whatsapp=clinic.contact_whatsapp,
        contact_email=clinic.contact_email,
        cnpj=clinic.cnpj,
        created_at=clinic.created_at,
    )


@router.delete("/clinics/{clinic_id}")
def remove(clinic_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in {"admin", "recepcionista"}:
        raise HTTPException(status_code=403, detail="Not allowed")

    clinic_repo = ClinicRepositorySql(db)
    removed = delete_clinic(clinic_repo=clinic_repo, clinic_id=clinic_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return {"ok": True}


@router.delete("/clinics")
def remove_all(all: bool = False, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in {"admin", "recepcionista"}:
        raise HTTPException(status_code=403, detail="Not allowed")
    if not all:
        raise HTTPException(status_code=400, detail="Missing all=true")

    clinic_repo = ClinicRepositorySql(db)
    removed = delete_all_clinics(clinic_repo=clinic_repo)
    return {"ok": True, "removed": removed}
