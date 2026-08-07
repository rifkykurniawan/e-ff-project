import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { BudgetsPage } from "../pages/BudgetsPage";
import { setupBudgetsApiMocks } from "../utils/mockApi";

test.describe("Monthly Budgets E2E Tests (Milestone 4)", () => {
  let loginPage: LoginPage;
  let budgetsPage: BudgetsPage;

  const GROCERIES_CATEGORY_ID = "00000000-0000-4000-a000-000000000004";

  const mockCategories = [
    { id: GROCERIES_CATEGORY_ID, name: "Groceries", type: "Expense", created_at: new Date().toISOString() },
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    budgetsPage = new BudgetsPage(page);

    await setupBudgetsApiMocks(page, {
      categories: mockCategories,
      budgets: [],
      transactions: [],
    });

    const testEmail = process.env.TEST_USER_EMAIL || "test@family.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "password123";

    await test.step("Log in as authenticated user", async () => {
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
    });
  });

  test(qase(16, "TC-001-BDGT: Create Monthly Budget"), async () => {
    await test.step("Navigate to the Budgets page", async () => {
      await budgetsPage.goto();
    });

    await test.step("Set a planned budget for category", async () => {
      await budgetsPage.setCategoryBudget("Groceries", 2000000);
    });

    await test.step("Verify budget limits are displayed", async () => {
      const row = budgetsPage.getCategoryRow("Groceries");
      await expect(row).toBeVisible();
      await expect(row).toContainText("Rp 2,000,000");
    });
  });

  test(qase(17, "TC-002-BDGT: Budget Actual & Remaining Calculation"), async ({ page }) => {
    const startDateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;

    await setupBudgetsApiMocks(page, {
      categories: mockCategories,
      budgets: [
        {
          id: "b-groceries",
          category_id: GROCERIES_CATEGORY_ID,
          year: currentYear,
          month: currentMonth,
          planned_amount: 2000000,
        },
      ],
      transactions: [
        {
          id: "tx-grocery-1",
          description: "Grocery shopping",
          amount: 500000,
          type: "Expense",
          date: startDateStr,
          category_id: GROCERIES_CATEGORY_ID,
        },
      ],
    });

    await test.step("Navigate to the Budgets page", async () => {
      await budgetsPage.goto();
    });

    await test.step("Verify actual spent and remaining calculations", async () => {
      const row = budgetsPage.getCategoryRow("Groceries");
      await expect(row).toBeVisible();
      await expect(row).toContainText("Rp 2,000,000"); // Planned
      await expect(row).toContainText("Rp 500,000");   // Actual
      await expect(row).toContainText("Rp 1,500,000"); // Remaining
    });
  });

  test(qase(18, "TC-003-BDGT: Overspending Visual Alert"), async ({ page }) => {
    const startDateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;

    await setupBudgetsApiMocks(page, {
      categories: mockCategories,
      budgets: [
        {
          id: "b-groceries-over",
          category_id: GROCERIES_CATEGORY_ID,
          year: currentYear,
          month: currentMonth,
          planned_amount: 2000000,
        },
      ],
      transactions: [
        {
          id: "tx-grocery-over",
          description: "Heavy grocery shopping",
          amount: 2500000,
          type: "Expense",
          date: startDateStr,
          category_id: GROCERIES_CATEGORY_ID,
        },
      ],
    });

    await test.step("Navigate to the Budgets page", async () => {
      await budgetsPage.goto();
    });

    await test.step("Verify overspending alert badge and negative remaining balance", async () => {
      const row = budgetsPage.getCategoryRow("Groceries");
      await expect(row).toBeVisible();
      await expect(row).toContainText("-Rp 500,000");
      await expect(row).toContainText("Overspent!");
    });
  });
});
