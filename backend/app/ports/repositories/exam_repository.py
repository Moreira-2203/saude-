from __future__ import annotations

from typing import Protocol

from ...domain.entities.exam import Exam


class ExamRepository(Protocol):
    def list_by_patient(self, patient_id: str) -> list[Exam]: ...

    def create(self, patient_id: str, name: str, lab: str, file_url: str) -> Exam: ...

    def delete(self, exam_id: str, patient_id: str) -> bool: ...
