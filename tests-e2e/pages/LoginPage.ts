import { type Page, type Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly themeToggleButton: Locator;
  readonly signUpLink: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("login-email-input");
    this.passwordInput = page.getByTestId("login-password-input");
    this.submitButton = page.getByTestId("login-submit-button");
    this.errorAlert = page.locator(".text-red-650, .text-red-400, [role='alert']");
    this.themeToggleButton = page.getByTestId("theme-toggle-button");
    this.signUpLink = page.getByRole("link", { name: /sign up/i });
    this.emailValidationError = page.locator("text=Please enter a valid email address");
    this.passwordValidationError = page.locator("text=Password must be at least 8 characters");
  }


  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }

  async clickSignUpLink() {
    await this.signUpLink.click();
  }
}
