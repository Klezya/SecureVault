<div align="center">

# 🔐 SecureVault

**A deployable web vault for passwords and private notes, built around modern security practices.**

![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

</div>

---

> [!WARNING]
> **🚧 Work in Progress** — This project is actively under development. Core infrastructure is in place, but several features are not yet implemented. Expect breaking changes.

---

## 📖 About

SecureVault is a full-stack portfolio project focused on experimenting with web security concepts: **password hashing**, **JWT authentication**, and **handling sensitive data safely**. It provides a simple interface for storing passwords and private notes, using a modern Angular + FastAPI stack.

This is not meant to replace production-grade password managers — it's an intentional deep-dive into the practices that make them secure.

---

## ✨ Features

### ✅ Implemented
- User registration with **Argon2** password hashing
- PostgreSQL schema with UUID primary keys
- Dockerized environment with hot-reload for development
- Angular 21 standalone component architecture
- Lazy-loaded routing for vault sections

### 🔜 Coming Soon
- JWT-based login & session management
- Password vault (CRUD)
- Private notes (CRUD)
- Encryption of stored secrets
- Responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Angular 21, TypeScript, Tailwind CSS 4, Signals |
| **Backend** | FastAPI, SQLModel, PyJWT, pwdlib (Argon2) |
| **Database** | PostgreSQL 18 |
| **Infrastructure** | Docker, Docker Compose, uv |
| **Testing** | Vitest |

---

## 🏗️ Project Structure

```
SecureVault/
├── frontend/           # Angular 21 SPA
│   └── src/app/
│       ├── auth/       # Login & Register
│       ├── home/       # Dashboard
│       └── features/
│           ├── passwords/
│           └── notes/
│
├── backend/            # FastAPI REST API
│   ├── core/           # DB engine & settings
│   ├── auth/           # Hashing utilities
│   └── features/
│       ├── users/
│       ├── passwords/
│       └── notes/
│
└── compose.yml
```

---

## 🚀 Running Locally

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose

```bash
git clone https://github.com/Klezya/SecureVault.git
cd SecureVault

# Change to development branch
git checkout development

cp backend/.env.example backend/.env

docker compose up --watch
```

| Service | URL |
|---|---|
| API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## 🔐 Security Concepts Explored

- **Argon2 hashing** via `pwdlib` — recommended algorithm from the Password Hashing Competition
- **JWT** for stateless, signed session tokens
- **Encrypted storage** for secrets (planned — AES-256)
- Docker container running as a **non-root user**

---

## 📡 API Endpoints

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/` | Health check | ✅ |
| `POST` | `/api/v1/auth/register/` | Register a new user | ✅ |
| `POST` | `/api/v1/auth/login/` | Login & get JWT | 🔜 |
| `GET/POST` | `/api/v1/passwords/` | Password vault | 🔜 |
| `GET/POST` | `/api/v1/notes/` | Notes | 🔜 |

---

## 📄 License

[MIT](./LICENSE)
