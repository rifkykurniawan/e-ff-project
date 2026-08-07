import { type Page, type Locator } from "@playwright/test";

export class TransactionsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly addTransactionButton: Locator;

  // Form locators
  readonly typeIncomeButton: Locator;
  readonly typeExpenseButton: Locator;
  readonly typeTransferButton: Locator;
  readonly descriptionInput: Locator;
  readonly amountInput: Locator;
  readonly dateInput: Locator;
  readonly sourceAccountSelect: Locator;
  readonly destinationAccountSelect: Locator;
  readonly categorySelect: Locator;
  readonly notesTextarea: Locator;
  readonly submitButton: Locator;

  // Filter locators
  readonly filterAccountSelect: Locator;
  readonly filterCategorySelect: Locator;
  readonly filterTypeSelect: Locator;
  readonly filterStartDateInput: Locator;
  readonly filterEndDateInput: Locator;
  readonly clearFiltersButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Transactions", exact: true });
    this.addTransactionButton = page.getByTestId("add-transaction-button");

    this.typeIncomeButton = page.getByTestId("transaction-type-income-button");
    this.typeExpenseButton = page.getByTestId("transaction-type-expense-button");
    this.typeTransferButton = page.getByTestId("transaction-type-transfer-button");
    this.descriptionInput = page.getByTestId("transaction-description-input");
    this.amountInput = page.getByTestId("transaction-amount-input");
    this.dateInput = page.getByTestId("transaction-date-input");
    this.sourceAccountSelect = page.getByTestId("transaction-source-account-select");
    this.destinationAccountSelect = page.getByTestId("transaction-destination-account-select");
    this.categorySelect = page.getByTestId("transaction-category-select");
    this.notesTextarea = page.getByTestId("transaction-notes-textarea");
    this.submitButton = page.getByTestId("transaction-submit-button");

    this.filterAccountSelect = page.getByTestId("filter-account-select");
    this.filterCategorySelect = page.getByTestId("filter-category-select");
    this.filterTypeSelect = page.getByTestId("filter-type-select");
    this.filterStartDateInput = page.getByTestId("filter-start-date-input");
    this.filterEndDateInput = page.getByTestId("filter-end-date-input");
    this.clearFiltersButton = page.getByTestId("clear-filters-button");
  }

  async goto() {
    await this.page.goto("/transactions");
  }

  async openAddModal() {
    await this.addTransactionButton.click();
  }

  async createIncomeTransaction(params: {
    description: string;
    amount: number | string;
    destinationAccountId: string;
    categoryId?: string;
    date?: string;
    notes?: string;
  }) {
    await this.openAddModal();
    await this.typeIncomeButton.click();
    await this.descriptionInput.fill(params.description);
    await this.amountInput.fill(String(params.amount));
    if (params.date) {
      await this.dateInput.fill(params.date);
    }
    if (params.destinationAccountId) {
      await this.destinationAccountSelect.selectOption(params.destinationAccountId);
    }
    if (params.categoryId) {
      await this.categorySelect.selectOption(params.categoryId);
    }
    if (params.notes) {
      await this.notesTextarea.fill(params.notes);
    }
    await this.submitButton.click();
  }

  async createExpenseTransaction(params: {
    description: string;
    amount: number | string;
    sourceAccountId: string;
    categoryId?: string;
    date?: string;
    notes?: string;
  }) {
    await this.openAddModal();
    await this.typeExpenseButton.click();
    await this.descriptionInput.fill(params.description);
    await this.amountInput.fill(String(params.amount));
    if (params.date) {
      await this.dateInput.fill(params.date);
    }
    if (params.sourceAccountId) {
      await this.sourceAccountSelect.selectOption(params.sourceAccountId);
    }
    if (params.categoryId) {
      await this.categorySelect.selectOption(params.categoryId);
    }
    if (params.notes) {
      await this.notesTextarea.fill(params.notes);
    }
    await this.submitButton.click();
  }

  async createTransferTransaction(params: {
    description: string;
    amount: number | string;
    sourceAccountId: string;
    destinationAccountId: string;
    date?: string;
    notes?: string;
  }) {
    await this.openAddModal();
    await this.typeTransferButton.click();
    await this.descriptionInput.fill(params.description);
    await this.amountInput.fill(String(params.amount));
    if (params.date) {
      await this.dateInput.fill(params.date);
    }
    if (params.sourceAccountId) {
      await this.sourceAccountSelect.selectOption(params.sourceAccountId);
    }
    if (params.destinationAccountId) {
      await this.destinationAccountSelect.selectOption(params.destinationAccountId);
    }
    if (params.notes) {
      await this.notesTextarea.fill(params.notes);
    }
    await this.submitButton.click();
  }

  async deleteTransactionRow(rowLocator: Locator) {
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await rowLocator.getByTestId("delete-transaction-button").click();
  }

  getTransactionRow(description: string): Locator {
    return this.page.locator("tr").filter({ hasText: description });
  }
}
