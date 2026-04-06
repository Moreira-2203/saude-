from __future__ import annotations

from ...ports.repositories.exam_repository import ExamRepository


def create_exam(exam_repo: ExamRepository, patient_id: str, name: str, lab: str, file_url: str):
    return exam_repo.create(patient_id=patient_id, name=name, lab=lab, file_url=file_url)
