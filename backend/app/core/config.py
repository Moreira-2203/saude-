from __future__ import annotations

from dataclasses import dataclass
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_STATIC_DIR = str(PROJECT_ROOT)
DEFAULT_EXAMS_DIR = str(PROJECT_ROOT / "assets" / "exames")


@dataclass(frozen=True)
class Settings:
    database_url: str
    secret_key: str
    session_cookie_name: str
    session_days_default: int
    session_days_remember: int
    static_dir: str
    exams_dir: str
    exams_max_mb: int


def load_settings() -> Settings:
    static_dir = os.getenv("STATIC_DIR", DEFAULT_STATIC_DIR)
    return Settings(
        database_url=os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg2://postgres:postgres@localhost:5432/saude",
        ),
        secret_key=os.getenv("SECRET_KEY", "change-this-secret"),
        session_cookie_name=os.getenv("SESSION_COOKIE_NAME", "session_id"),
        session_days_default=int(os.getenv("SESSION_DAYS_DEFAULT", "1")),
        session_days_remember=int(os.getenv("SESSION_DAYS_REMEMBER", "30")),
        static_dir=static_dir,
        exams_dir=os.getenv("EXAMS_DIR", DEFAULT_EXAMS_DIR),
        exams_max_mb=int(os.getenv("EXAMS_MAX_MB", "10")),
    )
