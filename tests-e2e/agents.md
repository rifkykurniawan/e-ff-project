# AGENTS.md - E2E Testing Suite (tests-e2e)

## Overview & Scope

You are a Senior QA Automation Engineer specializing in End-to-End (E2E) testing with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

This directory (`tests-e2e/`) contains the complete automated test suite for the **Family Finance** web application.

---

## Core Guidelines & Principles

### 1. Mandatory Page Object Model (POM)
- **ALWAYS** implement the Page Object Model pattern for all UI interactions.
- Page classes must be located in `pages/` (e.g., `LoginPage.ts`, `DashboardPage.ts`).
- Spec files in `tests/` must consume Page Objects rather than defining inline element selectors or actions.
- Encapsulate interactive behaviors (e.g., `login(email, password)`, `createTransaction(data)`) inside Page methods.

### 2. Element Locators
- Prefer using `data-testid` attributes via `page.getByTestId('id-name')`.
- Ensure corresponding frontend components have matching `data-testid` attributes as specified in the main project guidelines.
- Use Playwright semantic locators (`getByRole`, `getByLabel`, `getByText`) when `data-testid` is not applicable.
- Avoid fragile CSS paths or relative XPaths.

### 3. Execution Safety Rule
- **NEVER** run automated tests (`npx playwright test`, `npm run test`, `npm run test:ui`, etc.) without asking for explicit permission from the user first.

---

## Directory Structure

```
tests-e2e/
├── pages/                  # Page Object Models (POM classes)
│   ├── LoginPage.ts        # POM for login/authentication
│   └── DashboardPage.ts    # POM for dashboard and navigation
├── tests/                  # Playwright spec test files
│   └── auth.spec.ts        # E2E test specs for authentication flows
├── playwright.config.ts    # Playwright configuration file
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and test scripts
└── .env.example            # Environment variables template
```

---

## Naming & Coding Standards

### File Naming
- **Page Objects**: `PascalCase.ts` inside `pages/` (e.g., `LoginPage.ts`, `TransactionsPage.ts`).
- **Spec Files**: `kebab-case.spec.ts` or `feature.spec.ts` inside `tests/` (e.g., `auth.spec.ts`, `budget.spec.ts`).

### Test Cases Name Format
- **Pattern**: `TC-[NUMBER]-[FEATURE]-[Description]`
- **`test(...)` Titles**: Format test case titles with `TC-[3-digit number]-[FEATURE_CODE]-[Capitalized description]`.
  - Format: `TC-XXX-MODULE-Description`
  - Example: `TC-001-AUTH-Should load the login page with all expected elements`
  - Example: `TC-002-AUTH-Should display validation errors when fields are empty`
  - Example: `TC-003-AUTH-Should fail login with incorrect credentials`
- **Qase Integration**: Wrap the title in `qase(CASE_ID, "TC-XXX-MODULE-Description")` when referencing a test case ID from Qase TMS.
  - Example: `test(qase(1, "TC-001-AUTH-Should load the login page with all expected elements"), async () => { ... })`
- **`test.describe` Blocks**: Name using Title Case describing the target feature suite (e.g., `test.describe("Authentication E2E Tests", ...)`).
- **`test.step(...)` Titles**: Name steps clearly starting with an action verb in Title/Sentence case explaining the user action or assertion.
  - Example: `await test.step("Attempt to log in with incorrect credentials", async () => { ... })`
  - Example: `await test.step("Verify validation errors are displayed", async () => { ... })`

### Page Class Structure
```typescript
import { type Page, type Locator } from "@playwright/test";

export class ExamplePage {
  readonly page: Page;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByTestId("example-submit-button");
  }

  async goto() {
    await this.page.goto("/example");
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
```

---

## Test Runner & Environment

- Environment variables are loaded from `tests-e2e/.env`.
- Base URL default: `http://localhost:5173`.
- WebServer: Configured in `playwright.config.ts` to automatically launch the frontend dev server if not already running.
- Reporters: Default HTML reporter, plus optional Qase reporter integration if tokens are configured.

---

## AI Assistant Workflow for E2E Tasks

1. **Plan & Review**: Inspect existing frontend components to identify necessary `data-testid` attributes.
2. **Implement POM**: Create or update the relevant Page Object in `pages/`.
3. **Write Specs**: Implement cleanly formatted spec files in `tests/` using Playwright test assertions (`expect(...)`).
4. **Request Permission**: Ask the user before running test commands to execute or verify the suite.
