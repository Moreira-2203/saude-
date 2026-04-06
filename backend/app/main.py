from __future__ import annotations

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

from .api.routers import appointments, auth, clinics, exams, users
from .core.config import load_settings
from .core.db import Base, engine

load_dotenv()
settings = load_settings()

app = FastAPI(title="Saude Local API", version="0.1.0")

app.include_router(auth.router, prefix="/api")
app.include_router(clinics.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(exams.router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    os.makedirs(settings.exams_dir, exist_ok=True)


@app.get("/")
def root():
    return RedirectResponse("/pages/index.html")


app.mount("/", StaticFiles(directory=settings.static_dir, html=True), name="static")
