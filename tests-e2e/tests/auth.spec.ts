import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Authentication E2E Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test(qase(1, "TC-001-AUTH-Should load the login page with all expected elements"), async () => {
    await test.step("Verify that all expected input elements are visible on the login page", async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });
  });

  test(qase(2, "TC-002-AUTH-Should display validation errors when fields are empty"), async ({ page }) => {
    await test.step("Click submit button without filling fields", async () => {
      await loginPage.submitButton.click();
    });
    
    await test.step("Verify validation errors are displayed", async () => {
      // Check if error messages are visible in form validation
      const emailError = page.locator("text=Please enter a valid email address");
      const passwordError = page.locator("text=Password must be at least 8 characters");
      await expect(emailError.or(passwordError).first()).toBeVisible();
    });
  });

  test(qase(3, "TC-003-AUTH-Should fail login with incorrect credentials"), async () => {
    await test.step("Attempt to log in with incorrect credentials", async () => {
      await loginPage.login("wrong@family.com", "wrongpassword123");
    });
    
    await test.step("Verify error alert is displayed", async () => {
      // Should display error alert containing bad credentials details
      await expect(loginPage.errorAlert.first()).toBeVisible();
    });
  });
});
