# Family Finance

Family Finance is a modern, personal finance management web application designed for a single family to collaboratively track income, expenses, budgets, and saving goals.

---

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod, Axios.
- **Backend**: FastAPI, Python 3.13+, SQLAlchemy 2, Alembic, PostgreSQL, Pydantic v2.
- **Session Management**: JWT Authentication.
- **Development**: Docker, Docker Compose.

---

## 📂 Project Structure

```
E-FF/
├── backend/                  # FastAPI Backend application
│   ├── app/                  # Main source package
│   │   ├── core/             # Configuration & global security
│   │   ├── database/         # Session & DB setup
│   │   ├── dependencies/     # Router dependencies
│   │   ├── models/           # SQLAlchemy models
│   │   ├── routers/          # API endpoint routes
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Business logic layer
│   │   ├── repositories/     # Database access layer
│   │   ├── middlewares/      # CORS and auth middlewares
│   │   └── utils/            # Helper functions
│   └── requirements.txt      # Python packages
├── frontend/                 # Vite + React Frontend application
│   ├── src/
│   │   ├── assets/           # Static files
│   │   ├── components/       # Global UI components
│   │   ├── constants/        # Fixed variables
│   │   ├── features/         # Feature modules
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Layout architectures
│   │   ├── pages/            # View pages
│   │   ├── routes/           # Routing configuration
│   │   ├── services/         # API service calls
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helper functions
├── docker/                   # Docker environment configurations
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
├── docs/                     # Technical specifications docs
│   ├── requirements.md       # Software Requirement Specification
│   ├── database.md           # Database Design
│   ├── api.md                # API Design Spec
│   ├── ui-guideline.md       # Visual Guidelines
│   └── roadmap.md            # Development Milestones
├── .env.example              # Development environment variables template
├── docker-compose.yml        # Docker compose definition
└── README.md                 # Project Overview (This file)
```

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have the following installed:
- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js v20+](https://nodejs.org/) (for local frontend development)
- [Python 3.13+](https://www.python.org/) (for local backend development)

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Local Development Setup (Manual)

If you prefer to run services natively (without Docker), follow these steps:

#### A. Database Configuration
1. Make sure your local PostgreSQL server is running.
2. Create the target database:
   ```bash
   createdb family_finance
   # Or using psql:
   psql -d postgres -c "CREATE DATABASE family_finance;"
   ```
3. Copy configuration settings:
   ```bash
   cp .env.example .env
   cp .env.example backend/.env
   ```
4. Adjust `DATABASE_URL` in both `.env` and `backend/.env` with your local PostgreSQL username and password.

#### B. Run Backend API
1. Navigate to the backend directory and set up a virtual environment:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
   ```
2. Install python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run Alembic migrations to create tables:
   ```bash
   alembic upgrade head
   ```
4. Run the user seeding script to create the initial user:
   ```bash
   python scripts/create_first_user.py
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will run on http://localhost:8000. Interactive Swagger documentation will be available at http://localhost:8000/docs.

#### C. Run Frontend SPA
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be active at http://localhost:5173.

### 4. Run with Docker Compose
To build and start all services (database, backend, and frontend) in containers:
```bash
docker compose up --build
```
- Frontend will be available at: http://localhost:5173
- Backend API will be available at: http://localhost:8000
- API Interactive Docs: http://localhost:8000/docs

