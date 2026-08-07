import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { SavingGoalsPage } from "../pages/SavingGoalsPage";
import { setupSavingGoalsApiMocks } from "../utils/mockApi";

test.describe("Saving Goals E2E Tests (Milestone 4)", () => {
  let loginPage: LoginPage;
  let savingGoalsPage: SavingGoalsPage;

  const CASH_ACCOUNT_ID = "00000000-0000-4000-a000-000000000001";
  const SAVINGS_ACCOUNT_ID = "00000000-0000-4000-a000-000000000002";
  const SAVINGS_CATEGORY_ID = "00000000-0000-4000-a000-000000000004";

  const mockAccounts = [
    { id: CASH_ACCOUNT_ID, name: "Cash Wallet", type: "Cash", balance: 5000000, created_at: new Date().toISOString() },
    { id: SAVINGS_ACCOUNT_ID, name: "Savings Pocket", type: "Savings", balance: 0, created_at: new Date().toISOString() },
  ];

  const mockCategories = [
    { id: SAVINGS_CATEGORY_ID, name: "Savings Contribution", type: "Expense", created_at: new Date().toISOString() },
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    savingGoalsPage = new SavingGoalsPage(page);

    await setupSavingGoalsApiMocks(page, {
      accounts: mockAccounts,
      categories: mockCategories,
      savingGoals: [],
      transactions: [],
    });

    const testEmail = process.env.TEST_USER_EMAIL || "test@family.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "password123";

    await test.step("Log in as authenticated user", async () => {
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
    });
  });

  test(qase(19, "TC-001-GOAL: Add Savings to Linked Saving Goal"), async () => {
    await test.step("Navigate to the Saving Goals page", async () => {
      await savingGoalsPage.goto();
    });

    await test.step("Create a saving goal linked to an account", async () => {
      await savingGoalsPage.createSavingGoal({
        name: "Emergency Fund",
        targetAmount: 10000000,
        accountId: SAVINGS_ACCOUNT_ID,
      });
    });

    await test.step("Verify goal card is displayed with account label", async () => {
      const card = savingGoalsPage.getGoalCard("Emergency Fund");
      await expect(card).toBeVisible();
      await expect(card).toContainText("Account: Savings Pocket");
    });

    await test.step("Add savings to the linked goal", async () => {
      const card = savingGoalsPage.getGoalCard("Emergency Fund");
      await savingGoalsPage.addSavingsToGoal(card, {
        amount: 1000000,
        sourceAccountId: CASH_ACCOUNT_ID,
      });
    });
  });

  test(qase(20, "TC-002-GOAL: Add Savings to Unlinked Saving Goal"), async () => {
    await test.step("Navigate to the Saving Goals page", async () => {
      await savingGoalsPage.goto();
    });

    await test.step("Create an unlinked saving goal", async () => {
      await savingGoalsPage.createSavingGoal({
        name: "Japan Trip",
        targetAmount: 10000000,
        currentAmount: 0,
      });
    });

    await test.step("Verify unlinked goal card is displayed", async () => {
      const card = savingGoalsPage.getGoalCard("Japan Trip");
      await expect(card).toBeVisible();
    });

    await test.step("Add savings to the unlinked goal", async () => {
      const card = savingGoalsPage.getGoalCard("Japan Trip");
      await savingGoalsPage.addSavingsToGoal(card, {
        amount: 500000,
        sourceAccountId: CASH_ACCOUNT_ID,
        categoryId: SAVINGS_CATEGORY_ID,
      });
    });
  });

  test(qase(21, "TC-003-GOAL: Delete a Saving Goal"), async () => {
    await test.step("Navigate to the Saving Goals page", async () => {
      await savingGoalsPage.goto();
    });

    await test.step("Create a goal to delete", async () => {
      await savingGoalsPage.createSavingGoal({
        name: "Goal To Delete",
        targetAmount: 1000000,
        currentAmount: 0,
      });
    });

    await test.step("Delete the saving goal", async () => {
      const card = savingGoalsPage.getGoalCard("Goal To Delete");
      await savingGoalsPage.deleteGoal(card);
    });

    await test.step("Verify goal is no longer visible", async () => {
      const card = savingGoalsPage.getGoalCard("Goal To Delete");
      await expect(card).not.toBeVisible();
    });
  });
});
