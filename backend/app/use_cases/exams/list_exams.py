from __future__ import annotations

from ...ports.repositories.exam_repository import ExamRepository


def list_exams(exam_repo: ExamRepository, patient_id: str):
    return exam_repo.list_by_patient(patient_id)
