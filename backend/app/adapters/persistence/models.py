from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from ...core.db import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ClinicModel(Base):
    __tablename__ = "clinics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(200), nullable=False)
    address = Column(Text, nullable=False)
    hours = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=False)
    contact_phone = Column(String(32), nullable=False)
    contact_whatsapp = Column(String(32), nullable=False)
    contact_email = Column(String(255), nullable=False)
    cnpj = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AppointmentModel(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    clinic_id = Column(String(36), ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    doctor_name = Column(String(120), nullable=False)
    specialty = Column(String(120), nullable=False)
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    clinic = relationship("ClinicModel")
    patient = relationship("UserModel")


class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    token_hash = Column(String(64), unique=True, nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ExamModel(Base):
    __tablename__ = "exams"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    patient_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    lab = Column(String(200), nullable=False)
    file_url = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    patient = relationship("UserModel")
