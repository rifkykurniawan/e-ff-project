# E Finance - E2E Automation Testing Suite

This directory contains the End-to-End (E2E) automation testing workspace for the **E Finance** project, implemented using **Playwright** and **TypeScript** with the **Page Object Model (POM)** pattern.

---

## Directory Structure

```
tests-e2e/
├── pages/                  # Page Object Models (POM)
│   ├── LoginPage.ts        # POM for authentication page actions
│   └── DashboardPage.ts    # POM for dashboard elements and sidebar actions
├── tests/                  # Playwright Spec Files
│   └── auth.spec.ts        # Redirections, validations, and credentials login scenarios
├── playwright.config.ts    # Playwright runner configuration (starts frontend dev server automatically)
├── tsconfig.json           # TypeScript configuration
└── package.json            # Node project configurations & dependency definitions
```

---

## Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Installation
Navigate to this directory and install all the test dependencies:
```bash
cd tests-e2e
npm install
```

### 3. Install Playwright Browsers
Install the browser binaries needed to run the tests:
```bash
npx playwright install chromium
```

---

## Commands

All test commands should be run inside the `/tests-e2e` folder:

| Command | Description |
| :--- | :--- |
| `npm run test` | Run E2E tests in headless mode across all defined browsers (Chromium, Firefox, WebKit). |
| `npm run test:ui` | Open Playwright's Interactive UI Mode to visually step through and debug tests. |
| `npm run test:debug` | Launch the Playwright Inspector to step through code execution line-by-line. |
| `npx playwright test --project=chromium` | Execute tests only on the Chromium desktop browser environment. |

---

## Writing Tests with POM

The test suite follows the **Page Object Model (POM)** pattern to keep tests clean, readable, and easy to maintain.

1. **Locators & Selectors**: Use custom `data-testid` attributes defined in the frontend components (e.g. `data-testid="login-email-input"`).
2. **Page Classes**: Keep selectors and actions inside the `pages/` directory classes (e.g. `LoginPage.ts`).
3. **Specs**: Keep only assertions and test setups inside the `tests/` directory (e.g. `auth.spec.ts`).
