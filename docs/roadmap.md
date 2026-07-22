# Development Roadmap - Family Finance

This document maps out the implementation plan for the **Family Finance** project. Following the development workflow defined in [agents.md](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/agents.md), each milestone focuses on building one feature completely (Database model to UI) before starting subsequent milestones.

---

## Milestone 1: Workspace Initialization & Core Authentication
*   **Objective**: Setup backend/frontend project templates, design database migration pipelines, and deploy JWT authentication.
*   **Dependencies**: None.
*   **Estimated Complexity**: Medium
*   **Tasks**:
    1.  **Backend Setup**: Initialize FastAPI with SQLAlchemy 2, Pydantic v2, Alembic migration environment, and PostgreSQL connection.
    2.  **User Model**: Create the database model for the `User` entity and generate initial Alembic migration.
    3.  **Auth Service**: Implement secure password hashing, verification, and JWT token issue/validation services.
    4.  **Auth Routers**: Build API endpoints for login (`POST /api/v1/auth/login`) and session verification (`GET /api/v1/auth/me`).
    5.  **Frontend Bootstrap**: Spin up React SPA with TypeScript, Vite, Tailwind CSS, shadcn/ui, and React Router.
    6.  **Auth UI**: Build login forms using React Hook Form + Zod, and configure TanStack Query state hydration for token validation.
*   **Definition of Done**:
    *   API runs locally and successfully handles credential checks.
    *   Frontend blocks navigation to dashboard routes and successfully redirects to a login screen.
    *   Entering correct user credentials issues a valid JWT and logs the user in.

---

## Milestone 2: Account and Custom Category Management
*   **Objective**: Build CRUD workflows for family accounts (with starting balances) and custom categories.
*   **Dependencies**: Milestone 1.
*   **Estimated Complexity**: Low-Medium
*   **Tasks**:
    1.  **DB Models**: Create models for `Account` (Cash, Bank, E-Wallet, Savings, Investment types) and `Category` (Income vs Expense types). Run Alembic migrations.
    2.  **Repositories & Services**: Implement business rules (e.g. enforce category type constraints, unique naming per category type).
    3.  **API Routes**: Build CRUD routes under `/api/v1/accounts` and `/api/v1/categories`.
    4.  **Frontend State Hooks**: Create React Hooks (`useAccounts`, `useCategories`) for state mutations.
    5.  **UI Components**: Develop list/grid views for accounts and category tables. Add modals (Dialog/Drawer) to create and edit accounts/categories.
*   **Definition of Done**:
    *   Accounts and Categories can be listed, added, edited, and deleted.
    *   Form validations correctly reject duplicate category names or unsupported account types.
    *   Deletion fails dynamically if foreign key checks are violated.

---

## Milestone 3: Core Transaction Ledger & Balance Integrity
*   **Objective**: Build the transaction logging engine with strict balance calculations for Income, Expenses, and Transfers.
*   **Dependencies**: Milestone 2.
*   **Estimated Complexity**: High
*   **Tasks**:
    1.  **DB Model**: Create the `Transaction` entity model. Enforce conditional constraint validations directly in PostgreSQL. Run migrations.
    2.  **Balance Sync Service**: Write transactional operations (in SQLAlchemy `with_for_update()`) to adjust account balances when:
        *   Income is logged (increases destination balance).
        *   Expense is logged (decreases source balance).
        *   Transfer is logged (moves balance from source to destination).
        *   A transaction is deleted (reverts balance changes).
    3.  **API Routes**: Build `/api/v1/transactions` CRUD endpoints with search, paging, and date filtering.
    4.  **Dynamic Ledger UI**: Build a responsive table containing filters by Account, Date Range, Category, and Transaction Type.
    5.  **Transaction Form**: Build a smart Form showing/hiding Account and Category select items dynamically based on the chosen type (Income, Expense, Transfer).
*   **Definition of Done**:
    *   Users can log and delete Incomes, Expenses, and Transfers.
    *   All transactions update the associated account balances in real-time.
    *   Conditional validations are met (e.g. Transfers cannot have categories; destination and source accounts cannot match).

---

## Milestone 4: Monthly Budgets & Saving Goals
*   **Objective**: Implement budget planning and savings targets.
*   **Dependencies**: Milestone 3.
*   **Estimated Complexity**: Medium
*   **Tasks**:
    1.  **DB Models**: Create models for `Budget` (month, year, category, amount) and `SavingGoal`. Run migrations.
    2.  **Budget Computations**: Write queries to calculate planned vs actual expenditure per category/month.
    3.  **Savings Goal Service**: Compute percentage progress towards savings goals.
    4.  **API Routes**: Build `/api/v1/budgets` and `/api/v1/saving-goals` endpoints.
    5.  **Budget & Goal UI**:
        *   Create monthly planning sheet (listing actual vs planned balances, color-coding overflows in red).
        *   Build saving goals cards featuring dynamic progress bars.
*   **Definition of Done**:
    *   Users can allocate budgets to specific categories for a given calendar month.
    *   The budget page reflects actual spending in real-time.
    *   Saving goals render progress calculations and allow goal creation.

---

## Milestone 5: Reporting Engine & Unified Dashboard
*   **Objective**: Create the main analytical landing page and data export formats.
*   **Dependencies**: Milestone 4.
*   **Estimated Complexity**: Medium
*   **Tasks**:
    1.  **Analytics Service**: Create query optimizations to aggregate monthly trend metrics and category breakdowns.
    2.  **API Routes**: Build `/api/v1/reports/dashboard`, `/api/v1/reports/monthly`, and `/api/v1/reports/yearly`.
    3.  **Visual Dashboard**:
        *   Build balance summaries, recent transactions, and goal widgets.
        *   Integrate charts (e.g. donut chart for category shares, line chart for monthly income vs expense).
    4.  **Export Layouts**: Structure raw JSON endpoints in a structured format suitable for PDF/Excel printing.
*   **Definition of Done**:
    *   Dashboard presents correct financial summaries.
    *   Interactive charts update when month/year parameters are updated.

---

## Milestone 6: Deployment & Final Validation
*   **Objective**: Set up production builds, continuous deployment, and run full verification testing.
*   **Dependencies**: Milestone 5.
*   **Estimated Complexity**: Low-Medium
*   **Tasks**:
    1.  **Configuration Check**: Ensure all environment variables are documented.
    2.  **Vercel Pipeline**: Configure frontend deployment via Vercel.
    3.  **Railway Backend**: Set up Railway database instances and backend runners.
    4.  **End-to-End Testing**: Execute complete flow validation checklists.
*   **Definition of Done**:
    *   Live staging URL is fully functional.
    *   Application runs cleanly under production parameters with no debug tags active.
