import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { ReportsPage } from "../pages/ReportsPage";
import { setupTransactionsApiMocks } from "../utils/mockApi";

test.describe("Reports Component and Calculation Validation (Milestone 3)", () => {
  let loginPage: LoginPage;
  let reportsPage: ReportsPage;

  const CASH_ACCOUNT_ID = "00000000-0000-4000-a000-000000000001";
  const BANK_ACCOUNT_ID = "00000000-0000-4000-a000-000000000002";
  const SALARY_CATEGORY_ID = "00000000-0000-4000-a000-000000000003";
  const GROCERIES_CATEGORY_ID = "00000000-0000-4000-a000-000000000004";
  const UTILITIES_CATEGORY_ID = "00000000-0000-4000-a000-000000000005";

  const mockAccounts = [
    { id: CASH_ACCOUNT_ID, name: "Cash Wallet", type: "Cash", balance: 1000000, created_at: new Date().toISOString() },
    { id: BANK_ACCOUNT_ID, name: "Bank Mandiri", type: "Bank", balance: 5000000, created_at: new Date().toISOString() },
  ];

  const mockCategories = [
    { id: SALARY_CATEGORY_ID, name: "Salary", type: "Income", created_at: new Date().toISOString() },
    { id: GROCERIES_CATEGORY_ID, name: "Groceries", type: "Expense", created_at: new Date().toISOString() },
    { id: UTILITIES_CATEGORY_ID, name: "Utilities", type: "Expense", created_at: new Date().toISOString() },
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    reportsPage = new ReportsPage(page);

    // Setup default API mocks first so authentication endpoints are intercepted during login
    await setupTransactionsApiMocks(page, {
      accounts: mockAccounts,
      categories: mockCategories,
      transactions: [],
    });

    const testEmail = process.env.TEST_USER_EMAIL || "test@family.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "password123";

    await test.step("Log in as authenticated user", async () => {
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
    });
  });

  test(qase(21, "TC-001-RPT: Verify Empty State on Reports Page"), async ({ page }) => {
    await test.step("Navigate to the Reports page", async () => {
      await reportsPage.goto();
    });

    await test.step("Verify total income, outcome, and net cash flow are zero", async () => {
      await expect(reportsPage.getSummaryCardValue("Total Income")).toContainText("Rp 0");
      await expect(reportsPage.getSummaryCardValue("Total Outcome")).toContainText("Rp 0");
      await expect(reportsPage.getSummaryCardValue("Net Cash Flow")).toContainText("Rp 0");
    });

    await test.step("Verify empty state messages are visible", async () => {
      await expect(page.locator("text=No income logged in this month.")).toBeVisible();
      await expect(page.locator("text=No outcome logged in this month.")).toBeVisible();
      await expect(page.locator("text=No income transactions in this period.")).toBeVisible();
      await expect(page.locator("text=No outcome transactions in this period.")).toBeVisible();
    });
  });

  test(qase(22, "TC-002-RPT: Verify Calculation and Category Breakdown"), async ({ page }) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthStr = String(now.getMonth() + 1).padStart(2, "0");

    const mockTransactions = [
      {
        id: "tx-1",
        description: "Monthly Payroll",
        amount: 5000000,
        type: "Income",
        date: `${currentYear}-${currentMonthStr}-05`,
        destination_account_id: BANK_ACCOUNT_ID,
        category_id: SALARY_CATEGORY_ID,
        categories: mockCategories[0],
        destination_accounts: mockAccounts[1],
      },
      {
        id: "tx-2",
        description: "Supermarket shopping",
        amount: 1200000,
        type: "Expense",
        date: `${currentYear}-${currentMonthStr}-10`,
        source_account_id: CASH_ACCOUNT_ID,
        category_id: GROCERIES_CATEGORY_ID,
        categories: mockCategories[1],
        source_accounts: mockAccounts[0],
      },
      {
        id: "tx-3",
        description: "Electricity bill",
        amount: 800000,
        type: "Expense",
        date: `${currentYear}-${currentMonthStr}-12`,
        source_account_id: BANK_ACCOUNT_ID,
        category_id: UTILITIES_CATEGORY_ID,
        categories: mockCategories[2],
        source_accounts: mockAccounts[1],
      },
    ];

    await test.step("Setup custom transactions route for this test", async () => {
      await page.route("**/rest/v1/transactions*", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockTransactions),
        });
      });
    });

    await test.step("Navigate to the Reports page", async () => {
      await reportsPage.goto();
    });

    await test.step("Verify summary card totals (Income = 5,000,000, Outcome = 2,000,000, Net = 3,000,000)", async () => {
      await expect(reportsPage.getSummaryCardValue("Total Income")).toContainText("Rp 5.000.000");
      await expect(reportsPage.getSummaryCardValue("Total Outcome")).toContainText("Rp 2.000.000");
      await expect(reportsPage.getSummaryCardValue("Net Cash Flow")).toContainText("Rp 3.000.000");
    });

    await test.step("Verify category breakdowns percentages and amounts", async () => {
      const salaryRow = reportsPage.getCategoryBreakdownRow("Salary");
      await expect(salaryRow).toContainText("Rp 5.000.000");
      await expect(salaryRow).toContainText("100%");

      const groceriesRow = reportsPage.getCategoryBreakdownRow("Groceries");
      await expect(groceriesRow).toContainText("Rp 1.200.000");
      await expect(groceriesRow).toContainText("60%");

      const utilitiesRow = reportsPage.getCategoryBreakdownRow("Utilities");
      await expect(utilitiesRow).toContainText("Rp 800.000");
      await expect(utilitiesRow).toContainText("40%");
    });

    await test.step("Verify transactions tables", async () => {
      const payrollTxRow = reportsPage.getTransactionRow("Salary");
      await expect(payrollTxRow).toBeVisible();
      await expect(payrollTxRow).toContainText("Salary");
      await expect(payrollTxRow).toContainText("+Rp 5.000.000");

      const groceryTxRow = reportsPage.getTransactionRow("Groceries");
      await expect(groceryTxRow).toBeVisible();
      await expect(groceryTxRow).toContainText("Groceries");
      await expect(groceryTxRow).toContainText("-Rp 1.200.000");
    });
  });

  test(qase(23, "TC-003-RPT: Verify Period Filtering"), async ({ page }) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    await test.step("Navigate to the Reports page", async () => {
      await reportsPage.goto();
    });

    await test.step("Filter by different month/year and verify dropdown change", async () => {
      await reportsPage.selectMonth(3); // March
      await expect(reportsPage.monthSelect).toHaveValue("3");

      await reportsPage.selectYear(currentYear - 1);
      await expect(reportsPage.yearSelect).toHaveValue(String(currentYear - 1));
    });
  });

  test(qase(24, "TC-004-RPT: Verify Export Functionality warning alert"), async ({ page }) => {
    await test.step("Navigate to the Reports page", async () => {
      await reportsPage.goto();
    });

    await test.step("Click Export PDF and verify release warning alert is triggered", async () => {
      let alertMessage = "";
      page.once("dialog", async (dialog) => {
        alertMessage = dialog.message();
        await dialog.dismiss();
      });

      await reportsPage.clickExportPdf();
      expect(alertMessage).toContain("Exporting monthly report as PDF is scheduled for the next release phase.");
    });
  });
});
