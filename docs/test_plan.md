# Test Plan - E Finance

This document outlines the testing strategy structured around the project's development milestones as detailed in [roadmap.md](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/docs/roadmap.md). Testing ensures that all functional, database, and security requirements defined in [requirements.md](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/docs/requirements.md) are met.

---

## 1. Testing Strategy

We structure verification into milestone-specific execution runs:
- **Milestone 1**: Core Authentication & Session guards.
- **Milestone 2**: Category & Account CRUD rules.
- **Milestone 3**: Transaction logic, trigger verification, and balance updates.
- **Milestone 4**: Monthly budgets and saving goals (linked/unlinked).
- **Milestone 5**: Analytics, charts, and export layouts.
- **Milestone 6**: Deployment validation and production-ready checks.
- **Milestone 7**: Registration flow and database Row Level Security (RLS) partition controls.

All detailed step-by-step execution scenarios are maintained in [test_cases.md](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/docs/test_cases.md).

---

## 2. Milestone Test Plans

### Milestone 1: Core Authentication & Session Management
- **Focus**: User login credentials, JWT extraction, routing guards, and session persistence.
- **Approaches**: E2E route navigation attempts, session storage manipulation.

### Milestone 2: Account and Custom Category Management
- **Focus**: Validation of CRUD schemas (Zod), duplicate naming checks, and initial balance logs.
- **Approaches**: Form input testing, database constraint testing (violating unique keys).

### Milestone 3: Core Transaction Ledger & Balance Integrity
- **Focus**: Validation of transaction types (Income, Expense, Transfer). Database triggers updating balances and reverting updates on deletion.
- **Approaches**: Trigger validation in SQL, balance checking in UI post-transaction submission, transfer restrictions.

### Milestone 4: Monthly Budgets & Saving Goals
- **Focus**: Budget actual calculations (automatic sum of monthly expenses) and saving goal contributions (linked vs unlinked).
- **Approaches**: Mock transactions in current and previous months, checking goal balance aggregation from linked accounts.

### Milestone 5: Reporting Engine & Unified Dashboard
- **Focus**: Accurate metrics display (total balance, monthly income/expense trends, categories) and file export scaffolding.
- **Approaches**: Visual verification of charts and export structure validation.

### Milestone 6: Deployment & Final Validation
- **Focus**: SSL configuration, Vercel build verification, and automated E2E suites execution.
- **Approaches**: Checking CORS rules, routing fallback configs, and error responses.

### Milestone 7: Sign Up & User Data Isolation
- **Focus**: New user registration, default unverified state, manual DB verification, and database RLS policy enforcement.
- **Approaches**: Attempting cross-user database requests, verifying profile creation triggers.
