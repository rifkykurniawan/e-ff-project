import { type Page, type Locator } from "@playwright/test";

export class CategoriesPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly addCategoryButton: Locator;
  readonly emptyStateTitle: Locator;
  readonly categoryNameInput: Locator;
  readonly categoryTypeSelect: Locator;
  readonly submitButton: Locator;
  readonly expenseCategoriesHeading: Locator;
  readonly incomeCategoriesHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: "Categories", exact: true });
    this.pageSubtitle = page.getByText("Organize your income and expenses.");
    this.addCategoryButton = page.getByTestId("add-category-button");
    this.emptyStateTitle = page.getByText("No categories found");
    this.categoryNameInput = page.getByTestId("category-name-input");
    this.categoryTypeSelect = page.getByTestId("category-type-select");
    this.submitButton = page.getByTestId("category-submit-button");
    this.expenseCategoriesHeading = page.getByRole("heading", { name: "Expense Categories" });
    this.incomeCategoriesHeading = page.getByRole("heading", { name: "Income Categories" });
  }

  async goto() {
    await this.page.goto("/categories");
  }

  async openAddCategoryModal() {
    await this.addCategoryButton.click();
  }

  async createCategory(name: string, type: "Expense" | "Income") {
    await this.openAddCategoryModal();
    await this.categoryNameInput.fill(name);
    await this.categoryTypeSelect.selectOption(type);
    await this.submitButton.click();
  }

  async openEditCategoryModal(categoryName: string) {
    const item = this.getCategoryItem(categoryName);
    await item.hover();
    await item.getByTestId("edit-category-button").click({ force: true });
  }

  async editCategory(oldName: string, newName: string, newType: "Expense" | "Income") {
    await this.openEditCategoryModal(oldName);
    await this.categoryNameInput.fill(newName);
    await this.categoryTypeSelect.selectOption(newType);
    await this.submitButton.click();
  }

  async deleteCategory(categoryName: string) {
    const item = this.getCategoryItem(categoryName);
    await item.hover();

    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await item.getByTestId("delete-category-button").click({ force: true });
  }

  getCategoryItem(name: string): Locator {
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    return this.page.getByTestId(`category-item-${formattedName}`);
  }
}
