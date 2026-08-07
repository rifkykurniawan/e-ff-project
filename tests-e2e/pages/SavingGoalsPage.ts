import { type Page, type Locator } from "@playwright/test";

export class SavingGoalsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly addGoalButton: Locator;

  // Goal Form Locators
  readonly goalNameInput: Locator;
  readonly goalAccountSelect: Locator;
  readonly goalTargetAmountInput: Locator;
  readonly goalCurrentAmountInput: Locator;
  readonly goalTargetDateInput: Locator;
  readonly goalNotesTextarea: Locator;
  readonly goalSubmitButton: Locator;

  // Add Savings Form Locators
  readonly savingsAmountInput: Locator;
  readonly savingsSourceAccountSelect: Locator;
  readonly savingsCategorySelect: Locator;
  readonly savingsDateInput: Locator;
  readonly savingsSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Saving Goals", exact: true });
    this.addGoalButton = page.getByTestId("add-goal-button");

    this.goalNameInput = page.getByTestId("goal-name-input");
    this.goalAccountSelect = page.getByTestId("goal-account-select");
    this.goalTargetAmountInput = page.getByTestId("goal-target-amount-input");
    this.goalCurrentAmountInput = page.getByTestId("goal-current-amount-input");
    this.goalTargetDateInput = page.getByTestId("goal-target-date-input");
    this.goalNotesTextarea = page.getByTestId("goal-notes-textarea");
    this.goalSubmitButton = page.getByTestId("goal-submit-button");

    this.savingsAmountInput = page.getByTestId("savings-amount-input");
    this.savingsSourceAccountSelect = page.getByTestId("savings-source-account-select");
    this.savingsCategorySelect = page.getByTestId("savings-category-select");
    this.savingsDateInput = page.getByTestId("savings-date-input");
    this.savingsSubmitButton = page.getByTestId("savings-submit-button");
  }

  async goto() {
    await this.page.goto("/saving-goals");
  }

  async openAddGoalModal() {
    await this.addGoalButton.click();
  }

  async createSavingGoal(params: {
    name: string;
    targetAmount: number | string;
    currentAmount?: number | string;
    accountId?: string;
    targetDate?: string;
    notes?: string;
  }) {
    await this.openAddGoalModal();
    await this.goalNameInput.fill(params.name);
    if (params.accountId) {
      await this.goalAccountSelect.selectOption(params.accountId);
    }
    await this.goalTargetAmountInput.fill(String(params.targetAmount));

    if (!params.accountId && params.currentAmount !== undefined) {
      await this.goalCurrentAmountInput.fill(String(params.currentAmount));
    }
    if (params.targetDate) {
      await this.goalTargetDateInput.fill(params.targetDate);
    }
    if (params.notes) {
      await this.goalNotesTextarea.fill(params.notes);
    }
    await this.goalSubmitButton.click();
  }

  async addSavingsToGoal(
    goalCardLocator: Locator,
    params: {
      amount: number | string;
      sourceAccountId: string;
      categoryId?: string;
      date?: string;
    }
  ) {
    await goalCardLocator.getByTestId("add-savings-button").click();
    await this.savingsAmountInput.fill(String(params.amount));
    await this.savingsSourceAccountSelect.selectOption(params.sourceAccountId);
    if (params.categoryId && (await this.savingsCategorySelect.isVisible())) {
      await this.savingsCategorySelect.selectOption(params.categoryId);
    }
    if (params.date) {
      await this.savingsDateInput.fill(params.date);
    }
    await this.savingsSubmitButton.click();
  }

  async deleteGoal(goalCardLocator: Locator) {
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await goalCardLocator.getByTestId("delete-goal-button").click();
  }

  getGoalCard(name: string): Locator {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`goal-card-${formattedName}`);
  }
}
