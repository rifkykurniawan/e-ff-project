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

## Frontend & Backend (Serverless BaaS)

- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- Supabase JS SDK (`@supabase/supabase-js`)

## Database & Authentication

- Supabase Database (PostgreSQL)
- Supabase Auth (GoTrue)
- Supabase Row Level Security (RLS)

## Deployment

Frontend
- Vercel

Backend/Database
- Supabase

---

# Architecture

Since this is a Serverless BaaS architecture using Supabase, we do not have a dedicated backend application.

Database access rules and security are enforced at the database level using Row Level Security (RLS) policies.

Use the following structure for data access:

```
UI Pages / Components
         ↓
    React Hooks (Mutations / Queries)
         ↓
  Supabase Services / Queries (supabaseClient)
         ↓
   Supabase Database / Auth
```

Always perform user authorization checks and data security policies in Supabase RLS.

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

services/   # Contains Supabase query services and client initialization

types/      # TypeScript interfaces/types matching database schemas

utils/

constants/

assets/
```

Organize code by feature whenever possible.

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

Use Supabase client library (`supabase-js`) to query the database and trigger authentication.

Always handle Supabase errors gracefully and structure responses/errors consistently inside the UI.

---

# Validation

- Frontend validation is mandatory (React Hook Form + Zod).
- Database-level validation is mandatory (PostgreSQL check constraints, not-null constraints, and triggers).

---

# Database

Use Supabase PostgreSQL:
- Use UUID as primary keys.
- Use timestamps: `created_at` and `updated_at`.
- Enable Row Level Security (RLS) on all tables.
- For migrations, document SQL DDL scripts clearly for the Supabase SQL editor.

---

# Security

- Authentication is managed via Supabase Auth.
- Protect frontend routes by checking the active Supabase session.
- Secure database tables via Row Level Security (RLS) policies based on the authenticated user ID (`auth.uid()`).
- Never expose the Supabase Service Role key (secret key) to the frontend. Only use the Anon key.

---

# Error Handling

Provide meaningful error messages. Handle:
- Supabase API errors
- Form validation errors
- Constraint violation errors

---

# Logging

Use frontend console logging for debugging, ensuring no sensitive data (passwords, JWT tokens) is printed.

---

# Testing

Every feature should include:
- Manual testing checklist
- Edge cases

---

# Development Workflow

Always build one feature at a time. For every feature, follow this order:
1. Supabase Database Schema (Table definition SQL)
2. Row Level Security (RLS) Policies
3. Supabase Frontend Services
4. React Hook (TanStack Query)
5. Form and UI Component
6. Frontend Schema Validation (Zod)
7. Manual Testing Checklist

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