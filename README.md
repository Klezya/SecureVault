<div align="center">

# SecureVault

Learning project focused on AES-256 client-side encryption, zero-knowledge data handling, and modern full-stack security practices.

![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135+-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

</div>

> [!WARNING]
> This is a learning project and is NOT production-ready.
> Do not use it to store real secrets. Security hardening, threat modeling, and audits are incomplete.

## Project Goal

SecureVault is a portfolio/learning project that demonstrates how to build a web vault with end-to-end encrypted payload handling using Angular + FastAPI + PostgreSQL.

Primary objective:

- Learn and implement AES-256-based client-side encryption workflows in a realistic full-stack app.

## Audience

This README is written for recruiters and technical reviewers who want to quickly evaluate the architecture, security model, and implementation maturity.

## Current Status

Implemented:

- User registration and login.
- Access token (JWT) + refresh token session flow.
- Refresh token rotation with HttpOnly cookie.
- Vault item CRUD for authenticated users.
- Route guard and HTTP interceptor on frontend.
- Docker Compose local environment with live development flow (`docker compose up --watch`).

Needs improvement:

- Backend automated tests.
- Additional production hardening.
- More operational/security documentation.

## Tech Stack

| Layer          | Technology                                                  |
| -------------- | ----------------------------------------------------------- |
| Frontend       | Angular 21, TypeScript, Signals, RxJS, Tailwind CSS 4       |
| Backend        | FastAPI, SQLModel, PyJWT / python-jose, pwdlib (Argon2), uv |
| Database       | PostgreSQL 18                                               |
| Infrastructure | Docker, Docker Compose                                      |
| Testing        | Vitest (frontend)                                           |

## Security Model (Zero-Knowledge)

Design target:

- The backend should never process or persist plaintext secret content.
- Secret vault content is encrypted in the client before network transmission.
- The API stores encrypted payloads (ciphertext + IV) and metadata only.

Scope note:

- User identity/authentication fields still exist in backend models (for obvious account/session needs).

## Architecture Summary

### Frontend

- Angular SPA with standalone components.
- Lazy routes for home, login, register, and vault.
- Signal-based authentication state management.
- Crypto service for key derivation and AES-GCM encryption/decryption in the browser.

### Backend

- FastAPI REST API under `/api/v1`.
- Feature modules: users/auth and vault items.
- PostgreSQL persistence using SQLModel.
- CORS enabled for local frontend origin (`http://localhost:4200`).

## Project Structure

```text
SecureVault/
├── backend/
│   ├── auth/
│   ├── core/
│   ├── features/
│   │   ├── users/
│   │   └── vault/
│   └── main.py
├── frontend/
│   └── src/app/
│       ├── auth/
│       ├── core/
│       ├── home/
│       ├── shared/
│       └── vault/
└── compose.yml
```

## Run Locally (Docker)

Requirements:

- Docker
- Docker Compose v2

```bash
git clone https://github.com/Klezya/SecureVault.git
cd SecureVault

# Change to development branch
git checkout development

cp backend/.env.example backend/.env
docker compose up --watch
```

Exposed services:

| Service     | URL                         |
| ----------- | --------------------------- |
| Frontend    | http://localhost:4200       |
| Backend API | http://localhost:8000       |
| Swagger     | http://localhost:8000/docs  |
| ReDoc       | http://localhost:8000/redoc |
| PostgreSQL  | localhost:5432              |

## Backend Environment Variables

`backend/.env.example` includes:

```env
DATABASE_URL=postgresql://securevault_admin:securevault_password@db:5432/securevault_db
SECRET_KEY=<your-secret-key>
```

## API Snapshot

Local base URL: `http://localhost:8000/api/v1`

### Health

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/`       | Basic API status |
| GET    | `/health` | Healthcheck      |

### Auth

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/auth/salt/?email=...` | Fetches stored salt for login derivation           |
| POST   | `/auth/register/`       | Registers user                                     |
| POST   | `/auth/login/`          | Logs in and returns access token                   |
| POST   | `/auth/refresh/`        | Rotates refresh token and returns new access token |
| POST   | `/auth/logout/`         | Revokes refresh token and clears session           |

### Vault

| Method | Endpoint                  | Description                      |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/vault/items/`           | Lists current user's vault items |
| POST   | `/vault/items/`           | Creates vault item               |
| PATCH  | `/vault/items/{item_id}/` | Updates item                     |
| DELETE | `/vault/items/{item_id}/` | Deletes item                     |

Vault endpoints require Bearer authentication.

## Quick API Examples

Register:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
	-H "Content-Type: application/json" \
	-d '{
		"username": "alice",
		"email": "alice@example.com",
		"auth_hash": "<derived-auth-hash>",
		"salt_base64": "<salt-base64>"
	}'
```

Login:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
	-H "Content-Type: application/json" \
	-d '{
		"email": "alice@example.com",
		"auth_hash": "<derived-auth-hash>"
	}'
```

Create encrypted vault item:

```bash
curl -X POST http://localhost:8000/api/v1/vault/items/ \
	-H "Authorization: Bearer <access_token>" \
	-H "Content-Type: application/json" \
	-d '{
		"item_type": "password",
		"ciphertext": "<base64-ciphertext>",
		"iv": "<base64-iv>"
	}'
```

## Milestones

- M1: Stable auth flow (register/login/refresh/logout) with token rotation.
- M2: Stable encrypted vault CRUD for passwords and notes.
- M3: Improve backend test coverage and CI checks.
- M4: Security hardening pass and documentation update.

## Production Disclaimer

Even with zero-knowledge goals, this repository is currently for learning purposes only.
It has not undergone formal security review, penetration testing, or operational hardening required for production use.

## License

MIT. See `LICENSE`.
