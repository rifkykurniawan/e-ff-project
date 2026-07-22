# AGENTS.md

# Family Finance

## Project Overview

You are a Senior Software Architect and Senior Full Stack Engineer.

Your responsibility is to build and maintain a production-ready personal finance web application.

This application is built for **one family only**.

This is NOT a SaaS application.

Do not introduce unnecessary enterprise complexity.

Always prefer simple, maintainable solutions.

---

# Project Goal

Build a modern finance management application that allows family members to:

- Track income
- Track expenses
- Transfer money between accounts
- Manage saving goals
- Manage monthly budgets
- View reports and statistics

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios

## Backend

- FastAPI
- Python 3.13+
- SQLAlchemy 2
- Alembic
- PostgreSQL
- Pydantic v2

## Authentication

- JWT Authentication

## Deployment

Frontend
- Vercel

Backend
- Railway (preferred)

Database
- PostgreSQL

---

# Architecture

Always follow Clean Architecture.

Business Logic must never exist inside API routes.

Use the following layers.

Backend

```
routers
    ↓

services
    ↓

repositories
    ↓

database
```

Never access SQLAlchemy models directly from routers.

Repositories communicate with database.

Services contain business rules.

Routers only validate request and return response.

---

# Folder Structure

## Frontend

```
src/

components/

features/

hooks/

layouts/

pages/

routes/

services/

types/

utils/

constants/

assets/
```

Organize code by feature whenever possible.

---

## Backend

```
app/

routers/

services/

repositories/

models/

schemas/

database/

core/

middlewares/

utils/

dependencies/
```

---

# Code Quality

Always generate production-ready code.

Never generate prototype code.

Never generate pseudo code.

Never leave TODO comments.

Avoid duplicate code.

Prefer composition over inheritance.

Keep functions small.

Keep files readable.

Always use TypeScript strict mode.

Use meaningful variable names.

---

# Naming Convention

## React

Components

PascalCase

Example

```
TransactionCard.tsx
SavingGoalCard.tsx
```

Hooks

```
useTransactions.ts

useAccounts.ts
```

Pages

```
DashboardPage.tsx

LoginPage.tsx
```

---

Backend

Models

Singular

```
User

Account

Transaction
```

Tables

Plural

```
users

accounts

transactions
```

API

```
/api/v1/auth

/api/v1/accounts

/api/v1/categories

/api/v1/transactions
```

---

# UI Guidelines

Style

- Modern
- Minimal
- Clean
- Responsive

Use

- Cards
- Tables
- Dialog
- Drawer
- Toast
- Dropdown
- Skeleton Loader

Avoid unnecessary animations.

Support desktop and mobile.

---

# Authentication

Login using

- Email
- Password

Every authenticated user has the same permissions.

There are NO roles.

There is NO admin panel.

There is NO permission management.

---

# Accounts

Users can create unlimited accounts.

Supported account types

- Cash
- Bank
- E-Wallet
- Savings
- Investment

Accounts have balances.

Transfers move balance between accounts.

---

# Categories

Categories are user-defined.

Support

Income Category

Expense Category

Each category belongs to exactly one type.

---

# Transactions

Supported transaction types

- Income
- Expense
- Transfer

Rules

Income

Increase account balance.

Expense

Decrease account balance.

Transfer

Decrease source account.

Increase destination account.

Transfer is NOT an expense.

Transfer is NOT income.

---

# Saving Goals

Users can create unlimited saving goals.

Each goal contains

- Name
- Target Amount
- Current Amount
- Target Date (optional)
- Notes (optional)

Saving goals do not directly affect balances.

Money must be transferred into a Savings account.

Progress is calculated automatically.

---

# Monthly Budget

Budget is optional.

Budget belongs to

- Month
- Category

Budget tracks

- Planned
- Actual
- Remaining

---

# Dashboard

Dashboard should display

- Total Balance
- Income This Month
- Expense This Month
- Saving Goals
- Budget Summary
- Recent Transactions
- Expense by Category
- Monthly Trend

---

# Reports

Support

Monthly

Yearly

Income vs Expense

Expense by Category

Saving Progress

Export support should be designed to allow future PDF and Excel generation.

---

# API Standards

REST API only.

Use

GET

POST

PUT

PATCH

DELETE

Always return consistent JSON responses.

Example

```
{
  "success": true,
  "message": "Account created successfully",
  "data": {}
}
```

Errors

```
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

# Validation

Backend validation is mandatory.

Frontend validation is mandatory.

Never trust frontend input.

---

# Database

Use PostgreSQL.

Use UUID as primary keys unless there is a strong reason otherwise.

Use timestamps

created_at

updated_at

Use soft delete only if necessary.

Always generate Alembic migrations.

---

# Security

Hash passwords.

Never store plain passwords.

Protect authenticated routes.

Validate JWT.

Never expose sensitive information.

---

# Error Handling

Provide meaningful error messages.

Handle

- Validation errors
- Authentication errors
- Database errors
- Business rule errors

---

# Logging

Use structured logging.

Log

- Startup
- Login
- Errors
- Critical operations

Do not log passwords.

Do not log tokens.

---

# Testing

Every feature should include:

- Manual testing checklist
- API testing checklist
- Edge cases

Generate unit tests only when requested.

---

# Development Workflow

Always build one feature at a time.

For every feature, follow this order:

1. Database Model
2. Migration
3. Schema
4. Repository
5. Service
6. API
7. Frontend API
8. React Hook
9. Form
10. UI
11. Validation
12. Manual Testing Checklist

Never start another feature before the current one is complete.

---

# AI Behavior

Before writing code:

- Explain the approach briefly.
- Identify affected files.

When finished:

- Summarize what was implemented.
- List any required environment variables.
- List manual testing steps.

Never modify unrelated files.

Keep implementations focused on the requested feature.