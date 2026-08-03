# Test Cases - Family Finance

This document provides detailed, step-by-step test cases corresponding to each milestone defined in the [test_plan.md](file:///Users/rifkykurniawan/Documents/WORK%21%21/Project/E-FF/docs/test_plan.md).

---

## Milestone 1: Core Authentication & Session Management

### TC-M1-01: Login with Valid Credentials
*   **Description**: Verify that a verified user can log in successfully.
*   **Prerequisites**: A user exists in the database with `is_verified = true`.
*   **Steps**:
    1. Navigate to `/login`.
    2. Input the email and password of the verified user.
    3. Click the login button (`data-testid="login-submit"`).
*   **Expected Result**:
    *   The user is redirected to `/dashboard`.
    *   A valid Supabase session is saved in `localStorage`.
    *   The user's name is displayed in the navigation bar.

### TC-M1-02: Login with Invalid Credentials
*   **Description**: Verify that incorrect credentials return a clear validation error.
*   **Prerequisites**: None.
*   **Steps**:
    1. Navigate to `/login`.
    2. Input a wrong email or password.
    3. Click the login button.
*   **Expected Result**:
    *   An error message (e.g., "Invalid login credentials") is displayed on the UI.
    *   The user remains on the `/login` page.

### TC-M1-03: Route Guard Protection
*   **Description**: Verify that protected routes redirect to login if no session exists.
*   **Prerequisites**: No active session (clear `localStorage` / logged out).
*   **Steps**:
    1. Attempt to navigate directly to `/dashboard`.
    2. Attempt to navigate directly to `/accounts`.
*   **Expected Result**:
    *   The page redirects to `/login`.

---

## Milestone 2: Account and Custom Category Management

### TC-M2-01: Create a New Account
*   **Description**: Verify that a user can create an account with a starting balance.
*   **Prerequisites**: User is logged in.
*   **Steps**:
    1. Navigate to `/accounts`.
    2. Click the "Add Account" button (`data-testid="add-account-button"`).
    3. Enter the account name (e.g., "Bank Mandiri"), select type "Bank", and input an initial balance (e.g., `5000000`).
    4. Click submit.
*   **Expected Result**:
    *   The new account appears in the accounts list.
    *   The account balance displays `Rp 5,000,000`.

### TC-M2-02: Prevent Duplicate Account Names
*   **Description**: Verify that two accounts cannot have the same name for a single user.
*   **Prerequisites**: An account named "Cash Wallet" already exists.
*   **Steps**:
    1. Click "Add Account".
    2. Input name "Cash Wallet", select type "Cash", and enter balance `100000`.
    3. Click submit.
*   **Expected Result**:
    *   Validation fails (either from Zod or Supabase DB constraint).
    *   An error is displayed, and the duplicate account is not saved.

### TC-M2-03: Create a Custom Category
*   **Description**: Verify that custom categories of type Income or Expense can be created.
*   **Prerequisites**: User is logged in.
*   **Steps**:
    1. Navigate to `/categories`.
    2. Click "Add Category" (`data-testid="add-category-button"`).
    3. Enter name "Dining Out", select type "Expense".
    4. Click submit.
*   **Expected Result**:
    *   The category "Dining Out" is created successfully and listed under "Expense Categories".

---

## Milestone 3: Core Transaction Ledger & Balance Integrity

### TC-M3-01: Log an Income Transaction
*   **Description**: Verify logging an income updates the destination account balance.
*   **Prerequisites**: Account "Cash Wallet" exists with balance `1,000,000`; category "Salary" (Income) exists.
*   **Steps**:
    1. Navigate to `/transactions`.
    2. Click "Add Transaction".
    3. Select type "Income", select category "Salary", set destination account to "Cash Wallet", enter amount `2,000,000`, description "Monthly Salary", and date.
    4. Click submit.
*   **Expected Result**:
    *   The transaction is created and listed in the ledger.
    *   The balance of "Cash Wallet" is updated to `3,000,000` (verified on `/accounts` or dashboard).

### TC-M3-02: Log an Expense Transaction
*   **Description**: Verify logging an expense decreases the source account balance.
*   **Prerequisites**: Account "Cash Wallet" has balance `3,000,000`; category "Groceries" (Expense) exists.
*   **Steps**:
    1. Click "Add Transaction".
    2. Select type "Expense", select category "Groceries", set source account to "Cash Wallet", enter amount `500,000`, description "Weekly Grocery Run", and date.
    3. Click submit.
*   **Expected Result**:
    *   The transaction is created and listed.
    *   The balance of "Cash Wallet" is updated to `2,500,000`.

### TC-M3-03: Log a Transfer Transaction
*   **Description**: Verify a transfer moves money between source and destination accounts.
*   **Prerequisites**: "Bank Mandiri" has balance `5,000,000` and "Cash Wallet" has `2,500,000`.
*   **Steps**:
    1. Click "Add Transaction".
    2. Select type "Transfer", set source account to "Bank Mandiri", set destination account to "Cash Wallet", enter amount `1,000,000`, description "ATM Withdrawal", and date.
    3. Click submit.
*   **Expected Result**:
    *   The transaction is recorded.
    *   "Bank Mandiri" balance drops to `4,000,000`.
    *   "Cash Wallet" balance increases to `3,500,000`.

### TC-M3-04: Prevent Same-Account Transfer
*   **Description**: Verify that source and destination accounts cannot be the same.
*   **Prerequisites**: "Cash Wallet" exists.
*   **Steps**:
    1. Select type "Transfer", select "Cash Wallet" as both source and destination.
    2. Attempt to submit.
*   **Expected Result**:
    *   Validation fails (Zod/Frontend error or database constraint). The transfer is rejected.

### TC-M3-05: Delete a Transaction
*   **Description**: Verify deleting a transaction reverts the balance updates.
*   **Prerequisites**: An expense of `500,000` was logged from "Cash Wallet" (reducing it from `3,500,000` to `3,000,000`).
*   **Steps**:
    1. Locate the expense transaction in the ledger.
    2. Click the delete/trash icon (`data-testid="delete-transaction-button"`) and confirm.
*   **Expected Result**:
    *   The transaction is deleted.
    *   "Cash Wallet" balance reverts to `3,500,000`.

---

## Milestone 4: Monthly Budgets & Saving Goals

### TC-M4-01: Create Monthly Budget
*   **Description**: Verify that a budget can be set for a category and month.
*   **Prerequisites**: Category "Groceries" exists.
*   **Steps**:
    1. Navigate to `/budgets`.
    2. Select Year/Month (e.g., 2026/08) and click "Set Budget".
    3. Choose category "Groceries", set planned amount to `2,000,000`, and submit.
*   **Expected Result**:
    *   The budget line is created showing Planned: `Rp 2,000,000`, Actual: `Rp 0`, and Remaining: `Rp 2,000,000`.

### TC-M4-02: Budget Actual & Remaining Calculation
*   **Description**: Verify that expenses in a category automatically accumulate in the budget.
*   **Prerequisites**: Groceries budget exists for 2026/08 with Planned = `2,000,000`.
*   **Steps**:
    1. Create an expense of `500,000` under category "Groceries" on `2026-08-03`.
    2. Navigate to `/budgets` for August 2026.
*   **Expected Result**:
    *   The budget line displays Planned: `Rp 2,000,000`, Actual: `Rp 500,000`, and Remaining: `Rp 1,500,000`.

### TC-M4-03: Overspending Visual Alert
*   **Description**: Verify negative remaining balances are highlighted red.
*   **Prerequisites**: Groceries budget exists with Planned = `2,000,000`, Actual = `1,500,000` (Remaining = `500,000`).
*   **Steps**:
    1. Create another expense of `1,000,000` under "Groceries" on `2026-08-04`.
    2. Navigate to `/budgets` for August 2026.
*   **Expected Result**:
    *   Actual is `2,500,000`.
    *   Remaining is `-500,000`, colored red (or negative styling applied).

### TC-M4-04: Add Savings to Linked Saving Goal
*   **Description**: Verify contributing to a goal linked to a savings account logs a Transfer.
*   **Prerequisites**: Saving goal "Emergency Fund" is created and linked to account "Savings Pocket" (balance `0`).
*   **Steps**:
    1. Navigate to `/saving-goals`.
    2. Click "Add Savings" next to "Emergency Fund".
    3. Select source account "Bank Mandiri", input amount `1,000,000`, and click submit.
*   **Expected Result**:
    *   A Transfer transaction is logged from "Bank Mandiri" to "Savings Pocket".
    *   "Savings Pocket" balance increases to `1,000,000`.
    *   The "Emergency Fund" goal progress bar updates to reflect `1,000,000` current amount.

### TC-M4-05: Add Savings to Unlinked Saving Goal
*   **Description**: Verify contributing to an unlinked goal updates the goal directly and logs an Expense.
*   **Prerequisites**: Saving goal "Japan Trip" is created with target `10,000,000` and current amount `0` (unlinked/no account ID).
*   **Steps**:
    1. Click "Add Savings" next to "Japan Trip".
    2. Select source account "Cash Wallet", select expense category "Savings Contribution", input amount `500,000`, and submit.
*   **Expected Result**:
    *   An Expense transaction is logged from "Cash Wallet" under the "Savings Contribution" category.
    *   The "Japan Trip" saving goal `current_amount` increases directly to `500,000`.
    *   The progress updates to 5%.

---

## Milestone 5: Reporting Engine & Unified Dashboard

### TC-M5-01: Dashboard Live Metrics Update
*   **Description**: Verify Dashboard cards show current, correct aggregated balances.
*   **Prerequisites**: Total balance is `4,000,000` (Mandiri) + `3,000,000` (Cash Wallet) = `7,000,000`.
*   **Steps**:
    1. Navigate to `/dashboard`.
*   **Expected Result**:
    *   "Total Balance" card displays `Rp 7,000,000` (or masked if balances hidden).
    *   Recent Transactions lists the latest transactions correctly.

### TC-M5-02: Reports Page View
*   **Description**: Verify charts display correct breakdowns of monthly categories.
*   **Prerequisites**: Expense transactions logged in current month.
*   **Steps**:
    1. Navigate to `/reports`.
*   **Expected Result**:
    *   The category breakdown chart (donut/pie) shows accurate percentages matching the actual logged categories.
    *   Income vs. Expense bar chart displays correct values for the current period.

---

## Milestone 6: Deployment & Final Validation

### TC-M6-01: Production Build Checks
*   **Description**: Verify that the application compiles without TypeScript errors.
*   **Steps**:
    1. Run `npm run build` in the frontend directory.
*   **Expected Result**:
    *   Build succeeds without errors, generating a clean bundle in the `dist` folder.

---

## Milestone 7: Sign Up & User Data Isolation

### TC-M7-01: User Sign Up & Verification Flow
*   **Description**: Verify new user sign-up creates unverified account, which must be approved before login.
*   **Prerequisites**: Email `newfamily@test.com` is not registered.
*   **Steps**:
    1. Navigate to `/signup`.
    2. Enter first name, last name, email `newfamily@test.com`, and a password. Click Register.
    3. Try to log in with `newfamily@test.com` and password.
    4. Run database command/SQL editor update: `UPDATE public.users SET is_verified = true WHERE email = 'newfamily@test.com';`
    5. Log in again with the credentials.
*   **Expected Result**:
    *   Step 3: Login fails with error (indicating account is not verified yet).
    *   Step 5: Login succeeds after database update.

### TC-M7-02: Row Level Security (RLS) Enforcement
*   **Description**: Verify that User B cannot query or manipulate User A's data.
*   **Prerequisites**: User A and User B are both registered and verified. User A has an account named "User A Secret Bank".
*   **Steps**:
    1. Log in as User B.
    2. Inspect account list UI.
    3. Make a direct Supabase select request to `public.accounts` using User B's token.
*   **Expected Result**:
    *   User A's account "User A Secret Bank" does not show up in User B's UI.
    *   The direct query returns only User B's accounts (empty or own), confirming the RLS constraint `user_id = auth.uid()` is working.
