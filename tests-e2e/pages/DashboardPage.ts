import { type Page, type Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly balanceToggle: Locator;
  readonly quickActionIncome: Locator;
  readonly quickActionExpense: Locator;
  readonly quickActionTransfer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId("logout-button");
    this.balanceToggle = page.getByTestId("balance-visibility-toggle");
    this.quickActionIncome = page.getByTestId("quick-action-income");
    this.quickActionExpense = page.getByTestId("quick-action-expense");
    this.quickActionTransfer = page.getByTestId("quick-action-transfer");
  }

  async logout() {
    await this.logoutButton.click();
  }

  async toggleBalanceVisibility() {
    await this.balanceToggle.click();
  }
}
