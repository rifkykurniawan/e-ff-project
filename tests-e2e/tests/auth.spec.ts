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

  test(qase(2, "TC-002-AUTH-Should display validation errors when fields are empty"), async () => {
    await test.step("Click submit button without filling fields", async () => {
      await loginPage.submitButton.click();
    });
    
    await test.step("Verify validation errors are displayed", async () => {
      await expect(loginPage.emailValidationError.or(loginPage.passwordValidationError).first()).toBeVisible();
    });
  });

  test(qase(3, "TC-003-AUTH-Should fail login with incorrect credentials"), async () => {
    await test.step("Attempt to log in with incorrect credentials", async () => {
      await loginPage.login("wrong@family.com", "wrongpassword123");
    });
    
    await test.step("Verify error alert is displayed", async () => {
      await expect(loginPage.errorAlert.first()).toBeVisible();
    });
  });

  test(qase(4, "TC-004-AUTH-Should display validation error for invalid email format"), async () => {
    await test.step("Enter invalid email format and click submit", async () => {
      await loginPage.emailInput.fill("invalid-email-format");
      await loginPage.passwordInput.fill("password123");
      await loginPage.submitButton.click();
    });

    await test.step("Verify invalid email format error message is displayed", async () => {
      await expect(loginPage.emailValidationError).toBeVisible();
    });
  });

  test(qase(5, "TC-005-AUTH-Should navigate to sign up page when clicking sign up link"), async ({ page }) => {
    await test.step("Click Sign Up link on login card", async () => {
      await loginPage.clickSignUpLink();
    });

    await test.step("Verify user is redirected to the sign up page", async () => {
      await expect(page).toHaveURL(/\/signup/);
    });
  });

  test(qase(6, "TC-006-AUTH-Should toggle theme between light and dark mode"), async () => {
    await test.step("Click theme toggle button", async () => {
      await loginPage.toggleTheme();
    });

    await test.step("Verify theme toggle button state changed", async () => {
      await expect(loginPage.themeToggleButton).toBeVisible();
    });
  });
});
