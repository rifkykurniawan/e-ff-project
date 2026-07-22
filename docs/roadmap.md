# Development Roadmap - Family Finance

This document maps out the implementation plan for the **Family Finance** project. Following the development workflow defined in [agents.md](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/agents.md), each milestone focuses on building one feature completely (Database model to UI) before starting subsequent milestones.

---

## Milestone 1: Workspace Initialization & Core Authentication (Supabase Migration)
*   **Objective**: Setup frontend project template, configure Supabase client, and integrate Supabase Auth.
*   **Dependencies**: None.
*   **Estimated Complexity**: Medium
*   **Tasks**:
    1.  **Supabase Client Setup**: Install `@supabase/supabase-js` and configure environment variables in React Vite app.
    2.  **Supabase Client Initialization**: Initialize Supabase client in `src/services/supabaseClient.ts`.
    3.  **Auth Service Integration**: Refactor login and session hook to use Supabase Auth client instead of custom REST API endpoints.
    4.  **Auth UI Integration**: Update login form logic (React Hook Form + Zod) to perform login through Supabase.
*   **Definition of Done**:
    *   Supabase environment variables are defined.
    *   Frontend blocks navigation to dashboard routes and successfully redirects to a login screen when unauthenticated.
    *   Entering correct credentials in Supabase Auth logs the user in and establishes a session.

---

## Milestone 2: Account and Custom Category Management
*   **Objective**: Build CRUD workflows for family accounts (with starting balances) and custom categories.
*   **Dependencies**: Milestone 1.
*   **Estimated Complexity**: Low-Medium
*   **Tasks**:
    1.  **Supabase DB Models**: Create tables for `Account` (Cash, Bank, E-Wallet, Savings, Investment types) and `Category` (Income vs Expense types) in the Supabase SQL editor.
    2.  **RLS & Constraints**: Implement business rules via Row Level Security (RLS) policies and database check constraints (e.g., enforce category type constraints, unique naming).
    3.  **Frontend State Hooks**: Create React Hooks (`useAccounts`, `useCategories`) that use `supabaseClient` to fetch/mutate data.
    4.  **UI Components**: Develop list/grid views for accounts and category tables. Add modals (Dialog/Drawer) to create and edit accounts/categories.
*   **Definition of Done**:
    *   Accounts and Categories can be listed, added, edited, and deleted directly via Supabase API.
    *   Form validations and DB constraints correctly reject duplicate category names or unsupported account types.
    *   Deletion fails dynamically if foreign key checks are violated.

---

## Milestone 3: Core Transaction Ledger & Balance Integrity
*   **Objective**: Build the transaction logging engine with strict balance calculations for Income, Expenses, and Transfers.
*   **Dependencies**: Milestone 2.
*   **Estimated Complexity**: High
*   **Tasks**:
    1.  **Supabase DB Model**: Create the `Transaction` table. Enforce conditional constraint validations directly in PostgreSQL.
    2.  **Database Triggers / RPC**: Write PostgreSQL Triggers or Supabase RPC (Remote Procedure Calls) to adjust account balances atomically when:
        *   Income is logged (increases destination balance).
        *   Expense is logged (decreases source balance).
        *   Transfer is logged (moves balance from source to destination).
        *   A transaction is deleted (reverts balance changes).
    3.  **Frontend Hooks**: Build queries with `supabaseClient` featuring search, paging, and date filtering.
    4.  **Dynamic Ledger UI**: Build a responsive table containing filters by Account, Date Range, Category, and Transaction Type.
    5.  **Transaction Form**: Build a smart Form showing/hiding Account and Category select items dynamically.
*   **Definition of Done**:
    *   Users can log and delete Incomes, Expenses, and Transfers.
    *   All transactions update the associated account balances automatically via triggers.
    *   Conditional validations are met (e.g., Transfers cannot have categories; destination and source accounts cannot match).

---

## Milestone 4: Monthly Budgets & Saving Goals
*   **Objective**: Implement budget planning and savings targets.
*   **Dependencies**: Milestone 3.
*   **Estimated Complexity**: Medium
*   **Tasks**:
    1.  **Supabase DB Models**: Create tables for `Budget` and `SavingGoal`. Apply RLS.
    2.  **Budget Computations**: Write Supabase views or complex frontend queries to calculate planned vs actual expenditure per category/month.
    3.  **Savings Goal Service**: Compute percentage progress towards savings goals based on account allocations.
    4.  **Frontend Hooks**: Create hooks for budgets and saving goals.
    5.  **Budget & Goal UI**:
        *   Create monthly planning sheet (listing actual vs planned balances, color-coding overflows in red).
        *   Build saving goals cards featuring dynamic progress bars.
*   **Definition of Done**:
    *   Users can allocate budgets to specific categories for a given calendar month.
    *   The budget page reflects actual spending based on live Supabase data.
    *   Saving goals render progress calculations and allow goal creation.

---

## Milestone 5: Reporting Engine & Unified Dashboard
*   **Objective**: Create the main analytical landing page and data export formats.
*   **Dependencies**: Milestone 4.
*   **Estimated Complexity**: Medium
*   **Tasks**:
    1.  **Supabase Views / RPC**: Create SQL Views or RPCs to aggregate monthly trend metrics and category breakdowns efficiently.
    2.  **Dashboard Services**: Implement frontend services to fetch the aggregated data.
    3.  **Visual Dashboard**:
        *   Build balance summaries, recent transactions, and goal widgets.
        *   Integrate charts (e.g. donut chart for category shares, line chart for monthly income vs expense).
    4.  **Export Layouts**: Structure the fetched data into formats suitable for PDF/Excel printing.
*   **Definition of Done**:
    *   Dashboard presents correct financial summaries using real Supabase data.
    *   Interactive charts update when month/year parameters are updated.

---

## Milestone 6: Deployment & Final Validation
*   **Objective**: Set up production builds, continuous deployment, and run full verification testing.
*   **Dependencies**: Milestone 5.
*   **Estimated Complexity**: Low-Medium
*   **Tasks**:
    1.  **Configuration Check**: Ensure all Vercel environment variables (Supabase URL and Anon Key) are documented and applied.
    2.  **Vercel Pipeline**: Configure frontend deployment via Vercel.
    3.  **Supabase Verification**: Ensure all RLS policies are enabled and there is no unauthorized data access.
    4.  **End-to-End Testing**: Execute complete flow validation checklists.
*   **Definition of Done**:
    *   Live staging URL is fully functional.
    *   Application runs cleanly under production parameters with strict database security policies.
