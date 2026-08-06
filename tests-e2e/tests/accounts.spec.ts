import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { AccountsPage } from "../pages/AccountsPage";
import { setupAccountsApiMocks } from "../utils/mockApi";

test.describe("Accounts Management E2E Tests", () => {
  let loginPage: LoginPage;
  let accountsPage: AccountsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    accountsPage = new AccountsPage(page);

    await setupAccountsApiMocks(page);

    const testEmail = process.env.TEST_USER_EMAIL || "test@family.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "password123";

    await test.step("Log in as authenticated user", async () => {
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
    });
  });

  test(qase(10, "TC-000-ACC-Should load accounts page with expected UI components"), async () => {
    await test.step("Navigate to the Accounts page", async () => {
      await accountsPage.goto();
    });

    await test.step("Verify page header title and subtitle are visible", async () => {
      await expect(accountsPage.pageTitle).toBeVisible();
      await expect(accountsPage.pageSubtitle).toBeVisible();
    });

    await test.step("Verify Add Account button is visible", async () => {
      const addButton = accountsPage.addAccountButton.or(accountsPage.addFirstAccountButton).first();
      await expect(addButton).toBeVisible();
    });
  });

  test(qase(7, "TC-001-ACC-Should create a new account successfully"), async ({ page }) => {
    await test.step("Navigate to the Accounts page", async () => {
      await accountsPage.goto();
    });

    await test.step("Open creation modal and submit new account details", async () => {
      await accountsPage.createAccount("Main Savings", "Bank", 5000000);
    });

    await test.step("Verify the created account card and balance are displayed", async () => {
      const accountCard = accountsPage.getAccountCard("Main Savings");
      await expect(accountCard).toBeVisible();

      const accountBalance = accountsPage.getAccountBalance("Main Savings");
      await expect(accountBalance).toBeVisible();
    });
  });

  test(qase(8, "TC-002-ACC-Should update an existing account successfully"), async ({ page }) => {
    await test.step("Navigate to the Accounts page and create initial account", async () => {
      await accountsPage.goto();
      await accountsPage.createAccount("Emergency Fund", "Bank", 2000000);
    });

    await test.step("Open edit modal and submit updated details", async () => {
      await accountsPage.editAccount("Emergency Fund", "Updated Fund", "E-Wallet", 3500000);
    });

    await test.step("Verify updated account card and balance are displayed", async () => {
      const updatedCard = accountsPage.getAccountCard("Updated Fund");
      await expect(updatedCard).toBeVisible();

      const updatedBalance = accountsPage.getAccountBalance("Updated Fund");
      await expect(updatedBalance).toBeVisible();
    });
  });

  test(qase(9, "TC-003-ACC-Should delete an account successfully"), async ({ page }) => {
    await test.step("Navigate to the Accounts page and create account to delete", async () => {
      await accountsPage.goto();
      await accountsPage.createAccount("Temporary Wallet", "Cash", 500000);
    });

    await test.step("Click delete button and confirm deletion", async () => {
      await accountsPage.deleteAccount("Temporary Wallet");
    });

    await test.step("Verify the account card is no longer visible", async () => {
      const deletedCard = accountsPage.getAccountCard("Temporary Wallet");
      await expect(deletedCard).not.toBeVisible();
    });
  });
});
