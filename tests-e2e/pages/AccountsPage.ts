import { type Page, type Locator } from "@playwright/test";

export class AccountsPage {
  readonly page: Page;
  readonly addAccountButton: Locator;
  readonly addFirstAccountButton: Locator;
  readonly accountNameInput: Locator;
  readonly accountTypeSelect: Locator;
  readonly accountBalanceInput: Locator;
  readonly submitButton: Locator;

  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly emptyStateTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Accounts", exact: true });
    this.pageSubtitle = page.getByText("Manage your family's bank accounts, e-wallets, and cash.");
    this.emptyStateTitle = page.getByText("No accounts found");
    this.addAccountButton = page.getByTestId("add-account-button");
    this.addFirstAccountButton = page.getByTestId("add-first-account-button");
    this.accountNameInput = page.getByTestId("account-name-input");
    this.accountTypeSelect = page.getByTestId("account-type-select");
    this.accountBalanceInput = page.getByTestId("account-balance-input");
    this.submitButton = page.getByTestId("account-submit-button");
  }

  async goto() {
    await this.page.goto("/accounts");
  }

  async openAddAccountModal() {
    const addButton = this.addAccountButton.or(this.addFirstAccountButton).first();
    await addButton.click();
  }

  async createAccount(name: string, type: string, balance: number | string) {
    await this.openAddAccountModal();
    await this.accountNameInput.fill(name);
    await this.accountTypeSelect.selectOption(type);
    await this.accountBalanceInput.fill(String(balance));
    await this.submitButton.click();
  }

  async openEditAccountModal(accountName: string) {
    const card = this.getAccountCard(accountName);
    await card.hover();
    await card.getByTestId("edit-account-button").click({ force: true });
  }

  async editAccount(oldName: string, newName: string, newType: string, newBalance: number | string) {
    await this.openEditAccountModal(oldName);
    await this.accountNameInput.fill(newName);
    await this.accountTypeSelect.selectOption(newType);
    await this.accountBalanceInput.fill(String(newBalance));
    await this.submitButton.click();
  }

  async deleteAccount(accountName: string) {
    const card = this.getAccountCard(accountName);
    await card.hover();

    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await card.getByTestId("delete-account-button").click({ force: true });
  }

  getAccountCard(name: string): Locator {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`account-card-${formattedName}`);
  }

  getAccountBalance(name: string): Locator {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`account-balance-${formattedName}`);
  }
}
