from __future__ import annotations

from datetime import datetime

from ..core.db import SessionLocal
from ..core.security import hash_password
from ..adapters.persistence.models import (
    AppointmentModel,
    ClinicModel,
    ExamModel,
    SessionModel,
    UserModel,
)


def seed_mocks() -> None:
    db = SessionLocal()
    try:
        _clear(db)

        admin = UserModel(
            name="Admin",
            email="admin@local.test",
            password_hash=hash_password("admin123"),
            role="admin",
        )
        patient = UserModel(
            name="Paciente Demo",
            email="paciente@local.test",
            password_hash=hash_password("paciente123"),
            role="paciente",
        )
        db.add_all([admin, patient])
        db.flush()

        clinics = [
            ClinicModel(
                name="Clinica da Mulher",
                address="Tv. Arildo Ferreira Da Silva, 5 - Barreira",
                hours="07h-17h",
                description="Clinica municipal com foco em saude da mulher.",
                image_url="/assets/img/clinicadamulher.jpg",
                contact_phone="5522999611638",
                contact_whatsapp="5522999611638",
                contact_email="contato@clinicadamulher.com",
                cnpj="12345678000101",
            ),
            ClinicModel(
                name="CAPS AD",
                address="Rua Adolfo Bravo, 28 - Bacaxa",
                hours="08h-17h",
                description="Atendimento psicossocial e acompanhamento continuo.",
                image_url="/assets/img/caps.png",
                contact_phone="5522999999999",
                contact_whatsapp="5522999999999",
                contact_email="contato@capsad.com",
                cnpj="12345678000102",
            ),
        ]
        db.add_all(clinics)
        db.flush()

        demo_appt = AppointmentModel(
            clinic_id=clinics[0].id,
            patient_id=patient.id,
            doctor_name="Dra Ana Paula",
            specialty="ginecologia",
            date="12/11/2025",
            time="08:00",
            status="agendado",
        )
        db.add(demo_appt)

        demo_exam = ExamModel(
            patient_id=patient.id,
            name="Hemograma Completo",
            lab="Laboratorio Central",
            file_url="/assets/exames/hemograma.pdf",
        )
        db.add(demo_exam)

        db.commit()
    finally:
        db.close()


def _clear(db) -> None:
    db.query(SessionModel).delete()
    db.query(ExamModel).delete()
    db.query(AppointmentModel).delete()
    db.query(ClinicModel).delete()
    db.query(UserModel).delete()
    db.commit()
