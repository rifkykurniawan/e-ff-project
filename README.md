# E-Finance

E-Finance is a modern, personal finance management web application designed for a single family to track income, expenses, budgets, and saving goals with complete user data isolation (one account manages one dataset).

![E-Finance Dashboard](docs/ss.jpg)

---

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod.
- **Backend & Database**: Supabase (PostgreSQL, GoTrue Auth, Row Level Security).
- **Deployment**: Vercel (Frontend), Supabase (Database/Auth).

---

## 📂 Project Structure

```
E-FF/
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
│   │   ├── services/         # Supabase client and query services
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helper functions
│   └── package.json
├── tests-e2e/                # Playwright E2E automation testing suite
│   ├── pages/                # Page Object Models (POM)
│   ├── tests/                # Playwright spec files
│   └── playwright.config.ts  # Playwright runner configuration
├── docs/                     # Technical specifications docs
│   ├── requirements.md       # Software Requirement Specification
│   ├── database.md           # Database Design
│   ├── ui-guideline.md       # Visual Guidelines
│   ├── roadmap.md            # Development Milestones
│   ├── migration_signup.sql  # Database migration for user signup & RLS
│   ├── migration_saving_goals_account.sql # Database migration for linking saving goals to accounts
│   ├── test_plan.md          # Project Test Plan by Milestones
│   └── test_cases.md         # Detailed step-by-step Test Cases
├── .env.example              # Development environment variables template
└── README.md                 # Project Overview (This file)
```

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have the following installed:
- [Node.js v20+](https://nodejs.org/) (for local frontend development)

### 2. Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   cd frontend && cp ../.env.example .env
   ```
2. Fill in the `.env` variables using your Supabase project credentials (URL and Anon Key).

### 3. Database Setup (Supabase)
Before running the application, make sure to execute the SQL DDL statements located in [migration_signup.sql](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/docs/migration_signup.sql) in your **Supabase SQL Editor** to set up table partitioning, Row Level Security (RLS) policies, and auth profile triggers.

### 4. Local Development
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be active at http://localhost:5173.

### 5. Running E2E Tests
End-to-End tests are located in the [tests-e2e](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/tests-e2e) directory and are built using **Playwright**.

1. Navigate to the `tests-e2e` directory:
   ```bash
   cd tests-e2e
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```
4. Run tests:
   - Run tests in headless mode:
     ```bash
     npm run test
     ```
   - Open Interactive UI Mode (debugging):
     ```bash
     npm run test:ui
     ```
   - Launch Playwright inspector to debug:
     ```bash
     npm run test:debug
     ```
