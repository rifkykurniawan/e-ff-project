import { type Page, type Locator } from "@playwright/test";

export class BudgetsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;

  // Modal locators
  readonly plannedAmountInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Monthly Budget", exact: true });
    this.monthSelect = page.getByTestId("month-select");
    this.yearSelect = page.getByTestId("year-select");

    this.plannedAmountInput = page.getByTestId("planned-amount-input");
    this.submitButton = page.getByTestId("budget-submit-button");
  }

  async goto() {
    await this.page.goto("/budgets");
  }

  async selectMonth(monthValue: number) {
    await this.monthSelect.selectOption(String(monthValue));
  }

  async selectYear(yearValue: number) {
    await this.yearSelect.selectOption(String(yearValue));
  }

  async openEditBudgetModal(categoryName: string) {
    const formattedName = categoryName.toLowerCase().replace(/\s+/g, "-");
    const editButton = this.page.getByTestId(`edit-budget-button-${formattedName}`);
    await editButton.click();
  }

  async setCategoryBudget(categoryName: string, plannedAmount: number | string) {
    await this.openEditBudgetModal(categoryName);
    await this.plannedAmountInput.fill(String(plannedAmount));
    await this.submitButton.click();
  }

  getCategoryRow(categoryName: string): Locator {
    return this.page.locator("tr").filter({ hasText: categoryName });
  }
}
