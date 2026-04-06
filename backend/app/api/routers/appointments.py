from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...adapters.persistence.repositories.appointment_repository_sql import AppointmentRepositorySql
from ...core.db import get_db
from ...schemas.appointment import AppointmentCreate, AppointmentOut, AppointmentUpdate
from ...use_cases.appointments.create_appointment import create_appointment
from ...use_cases.appointments.list_appointments import list_appointments
from ...use_cases.appointments.update_appointment import update_appointment
from ..deps import get_current_user

router = APIRouter(tags=["appointments"])


@router.get("/appointments", response_model=list[AppointmentOut])
def list_for_user(db: Session = Depends(get_db), user=Depends(get_current_user)):
    appt_repo = AppointmentRepositorySql(db)
    appointments = list_appointments(appt_repo, patient_id=user.id)
    return [
        AppointmentOut(
            id=a.id,
            clinic_id=a.clinic_id,
            patient_id=a.patient_id,
            doctor_name=a.doctor_name,
            specialty=a.specialty,
            date=a.date,
            time=a.time,
            status=a.status,
            created_at=a.created_at,
        )
        for a in appointments
    ]


@router.post("/appointments", response_model=AppointmentOut)
def create(payload: AppointmentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    appt_repo = AppointmentRepositorySql(db)
    try:
        appointment = create_appointment(
            appointment_repo=appt_repo,
            clinic_id=payload.clinic_id,
            patient_id=user.id,
            doctor_name=payload.doctor_name,
            specialty=payload.specialty,
            date=payload.date,
            time=payload.time,
            status=payload.status,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return AppointmentOut(
        id=appointment.id,
        clinic_id=appointment.clinic_id,
        patient_id=appointment.patient_id,
        doctor_name=appointment.doctor_name,
        specialty=appointment.specialty,
        date=appointment.date,
        time=appointment.time,
        status=appointment.status,
        created_at=appointment.created_at,
    )


@router.patch("/appointments/{appointment_id}", response_model=AppointmentOut)
def update(
    appointment_id: str,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    appt_repo = AppointmentRepositorySql(db)
    try:
        appointment = update_appointment(
            appointment_repo=appt_repo,
            appointment_id=appointment_id,
            patient_id=user.id,
            date=payload.date,
            time=payload.time,
            status=payload.status,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return AppointmentOut(
        id=appointment.id,
        clinic_id=appointment.clinic_id,
        patient_id=appointment.patient_id,
        doctor_name=appointment.doctor_name,
        specialty=appointment.specialty,
        date=appointment.date,
        time=appointment.time,
        status=appointment.status,
        created_at=appointment.created_at,
    )
