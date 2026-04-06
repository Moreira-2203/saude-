from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
import os
import shutil
from uuid import uuid4
from sqlalchemy.orm import Session

from ...adapters.persistence.repositories.exam_repository_sql import ExamRepositorySql
from ...adapters.persistence.repositories.user_repository_sql import UserRepositorySql
from ...core.config import load_settings
from ...core.db import get_db
from ...schemas.exam import ExamOut
from ...use_cases.exams.create_exam import create_exam
from ...use_cases.exams.delete_exam import delete_exam
from ...use_cases.exams.list_exams import list_exams
from ..deps import get_current_user

router = APIRouter(tags=["exams"])
settings = load_settings()


@router.get("/exams", response_model=list[ExamOut])
def list_for_user(
    patient_id: str | None = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    exam_repo = ExamRepositorySql(db)
    target_patient_id = user.id
    if patient_id:
        if user.role not in {"admin", "recepcionista"}:
            raise HTTPException(status_code=403, detail="Not allowed")
        user_repo = UserRepositorySql(db)
        patient = user_repo.get_by_id(patient_id)
        if not patient:
            raise HTTPException(status_code=400, detail="Patient not found")
        target_patient_id = patient_id
    exams = list_exams(exam_repo, patient_id=target_patient_id)
    return [
        ExamOut(
            id=e.id,
            patient_id=e.patient_id,
            name=e.name,
            lab=e.lab,
            file_url=e.file_url,
            created_at=e.created_at,
        )
        for e in exams
    ]


@router.delete("/exams/{exam_id}")
def remove(exam_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    exam_repo = ExamRepositorySql(db)
    removed = delete_exam(exam_repo, exam_id=exam_id, patient_id=user.id)
    if not removed:
        raise HTTPException(status_code=404, detail="Exam not found")
    return {"ok": True}


@router.post("/exams", response_model=ExamOut)
def upload_exam(
    patient_id: str = Form(...),
    name: str = Form(...),
    lab: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role not in {"admin", "recepcionista"}:
        raise HTTPException(status_code=403, detail="Not allowed")

    user_repo = UserRepositorySql(db)
    patient = user_repo.get_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=400, detail="Patient not found")

    filename = file.filename or ""
    _, ext = os.path.splitext(filename.lower())
    allowed_exts = {".pdf", ".png", ".jpg", ".jpeg"}
    allowed_types = {"application/pdf", "image/png", "image/jpeg"}
    if ext not in allowed_exts or file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    stored_name = f"{uuid4().hex}{ext}"
    output_path = os.path.join(settings.exams_dir, stored_name)
    os.makedirs(settings.exams_dir, exist_ok=True)

    max_bytes = settings.exams_max_mb * 1024 * 1024
    size = 0
    try:
        with open(output_path, "wb") as output_file:
            while True:
                chunk = file.file.read(1024 * 1024)
                if not chunk:
                    break
                size += len(chunk)
                if size > max_bytes:
                    raise HTTPException(status_code=413, detail="File too large")
                output_file.write(chunk)
    except HTTPException:
        if os.path.exists(output_path):
            os.remove(output_path)
        raise

    file_url = f"/assets/exames/{stored_name}"
    exam_repo = ExamRepositorySql(db)
    exam = create_exam(
        exam_repo=exam_repo,
        patient_id=patient_id,
        name=name,
        lab=lab,
        file_url=file_url,
    )

    return ExamOut(
        id=exam.id,
        patient_id=exam.patient_id,
        name=exam.name,
        lab=exam.lab,
        file_url=exam.file_url,
        created_at=exam.created_at,
    )
