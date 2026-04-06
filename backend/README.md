# Saude Local Backend

Backend local para a PWA, com FastAPI + PostgreSQL e sessao via cookie.

## Requisitos
- Python 3.11+
- PostgreSQL local instalado e rodando

## Configuracao
1. Copie `.env.example` para `.env` e ajuste o `DATABASE_URL`.
2. Instale dependencias:
   - `pip install -r requirements.txt`

## Rodar localmente
- `uvicorn app.main:app --reload`
- Abra `http://localhost:8000/pages/index.html`

## Seeds
- Popular com dados mock:
  - `python -m app.seed --mode mocks`
- Limpar dados:
  - `python -m app.seed --mode empty`

## Observacoes
- A PWA e servida pelo mesmo backend para manter cookies de sessao.
- Ajuste `STATIC_DIR` no `.env` apenas se o backend nao estiver dentro da pasta `saude-`.
