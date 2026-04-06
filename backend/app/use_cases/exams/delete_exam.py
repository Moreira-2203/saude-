from __future__ import annotations

from ...ports.repositories.exam_repository import ExamRepository


def delete_exam(exam_repo: ExamRepository, exam_id: str, patient_id: str) -> bool:
    return exam_repo.delete(exam_id=exam_id, patient_id=patient_id)
