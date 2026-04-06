from __future__ import annotations

from sqlalchemy.orm import Session

from ....domain.entities.exam import Exam
from ...persistence.models import ExamModel


class ExamRepositorySql:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list_by_patient(self, patient_id: str) -> list[Exam]:
        models = (
            self._db.query(ExamModel)
            .filter(ExamModel.patient_id == patient_id)
            .order_by(ExamModel.created_at.desc())
            .all()
        )
        return [_to_entity(m) for m in models]

    def create(self, patient_id: str, name: str, lab: str, file_url: str) -> Exam:
        model = ExamModel(
            patient_id=patient_id,
            name=name,
            lab=lab,
            file_url=file_url,
        )
        self._db.add(model)
        self._db.commit()
        self._db.refresh(model)
        return _to_entity(model)

    def delete(self, exam_id: str, patient_id: str) -> bool:
        result = (
            self._db.query(ExamModel)
            .filter(ExamModel.id == exam_id, ExamModel.patient_id == patient_id)
            .delete()
        )
        self._db.commit()
        return result > 0


def _to_entity(model: ExamModel) -> Exam:
    return Exam(
        id=model.id,
        patient_id=model.patient_id,
        name=model.name,
        lab=model.lab,
        file_url=model.file_url,
        created_at=model.created_at,
    )
