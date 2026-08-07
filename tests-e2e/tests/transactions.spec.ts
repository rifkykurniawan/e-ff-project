import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { setupTransactionsApiMocks } from "../utils/mockApi";

test.describe("Transactions Ledger & Balance Integrity E2E Tests (Milestone 3)", () => {
  let loginPage: LoginPage;
  let transactionsPage: TransactionsPage;

  const CASH_ACCOUNT_ID = "00000000-0000-4000-a000-000000000001";
  const BANK_ACCOUNT_ID = "00000000-0000-4000-a000-000000000002";
  const SALARY_CATEGORY_ID = "00000000-0000-4000-a000-000000000003";
  const GROCERIES_CATEGORY_ID = "00000000-0000-4000-a000-000000000004";

  const mockAccounts = [
    { id: CASH_ACCOUNT_ID, name: "Cash Wallet", type: "Cash", balance: 1000000, created_at: new Date().toISOString() },
    { id: BANK_ACCOUNT_ID, name: "Bank Mandiri", type: "Bank", balance: 5000000, created_at: new Date().toISOString() },
  ];

  const mockCategories = [
    { id: SALARY_CATEGORY_ID, name: "Salary", type: "Income", created_at: new Date().toISOString() },
    { id: GROCERIES_CATEGORY_ID, name: "Groceries", type: "Expense", created_at: new Date().toISOString() },
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);

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

  test(qase(11, "TC-001-TRNS: Log an Income Transaction"), async () => {
    await test.step("Navigate to the Transactions page", async () => {
      await transactionsPage.goto();
    });

    await test.step("Log a new Income transaction", async () => {
      await transactionsPage.createIncomeTransaction({
        description: "Monthly Salary",
        amount: 2000000,
        destinationAccountId: CASH_ACCOUNT_ID,
        categoryId: SALARY_CATEGORY_ID,
      });
    });

    await test.step("Verify transaction appears in the ledger table", async () => {
      const row = transactionsPage.getTransactionRow("Monthly Salary");
      await expect(row).toBeVisible();
      await expect(row).toContainText("Income");
      await expect(row).toContainText("Salary");
      await expect(row).toContainText("To: Cash Wallet");
    });
  });

  test(qase(12, "TC-002-TRNS: Log an Expense Transaction"), async () => {
    await test.step("Navigate to the Transactions page", async () => {
      await transactionsPage.goto();
    });

    await test.step("Log a new Expense transaction", async () => {
      await transactionsPage.createExpenseTransaction({
        description: "Weekly Grocery Run",
        amount: 500000,
        sourceAccountId: CASH_ACCOUNT_ID,
        categoryId: GROCERIES_CATEGORY_ID,
      });
    });

    await test.step("Verify transaction appears in the ledger table", async () => {
      const row = transactionsPage.getTransactionRow("Weekly Grocery Run");
      await expect(row).toBeVisible();
      await expect(row).toContainText("Expense");
      await expect(row).toContainText("Groceries");
      await expect(row).toContainText("From: Cash Wallet");
    });
  });

  test(qase(13, "TC-003-TRNS: Log a Transfer Transaction"), async () => {
    await test.step("Navigate to the Transactions page", async () => {
      await transactionsPage.goto();
    });

    await test.step("Log a new Transfer transaction", async () => {
      await transactionsPage.createTransferTransaction({
        description: "ATM Withdrawal",
        amount: 1000000,
        sourceAccountId: BANK_ACCOUNT_ID,
        destinationAccountId: CASH_ACCOUNT_ID,
      });
    });

    await test.step("Verify transfer transaction appears in the ledger table", async () => {
      const row = transactionsPage.getTransactionRow("ATM Withdrawal");
      await expect(row).toBeVisible();
      await expect(row).toContainText("Transfer");
      await expect(row).toContainText("Bank Mandiri");
      await expect(row).toContainText("Cash Wallet");
    });
  });

  test(qase(14, "TC-004-TRNS: Prevent Same-Account Transfer"), async () => {
    await test.step("Navigate to the Transactions page", async () => {
      await transactionsPage.goto();
    });

    await test.step("Attempt to transfer between the same source and destination account", async () => {
      await transactionsPage.openAddModal();
      await transactionsPage.typeTransferButton.click();
      await transactionsPage.descriptionInput.fill("Self Transfer Test");
      await transactionsPage.amountInput.fill("100000");
      await transactionsPage.sourceAccountSelect.selectOption(CASH_ACCOUNT_ID);
      await transactionsPage.destinationAccountSelect.selectOption(CASH_ACCOUNT_ID);
      await transactionsPage.submitButton.click();
    });

    await test.step("Verify validation error prevents transaction submission", async () => {
      const errorText = transactionsPage.page.getByText("Source and destination accounts must be different");
      await expect(errorText).toBeVisible();
    });
  });

  test(qase(15, "TC-005-TRNS: Delete a Transaction"), async () => {
    await test.step("Navigate to the Transactions page", async () => {
      await transactionsPage.goto();
    });

    await test.step("Create a transaction to be deleted", async () => {
      await transactionsPage.createExpenseTransaction({
        description: "Transaction To Delete",
        amount: 500000,
        sourceAccountId: CASH_ACCOUNT_ID,
        categoryId: GROCERIES_CATEGORY_ID,
      });
    });

    await test.step("Verify created transaction row exists in ledger", async () => {
      const row = transactionsPage.getTransactionRow("Transaction To Delete");
      await expect(row).toBeVisible();
    });

    await test.step("Delete transaction and confirm dialog", async () => {
      const row = transactionsPage.getTransactionRow("Transaction To Delete");
      await transactionsPage.deleteTransactionRow(row);
    });

    await test.step("Verify transaction row is no longer visible", async () => {
      const row = transactionsPage.getTransactionRow("Transaction To Delete");
      await expect(row).not.toBeVisible();
    });
  });
});
