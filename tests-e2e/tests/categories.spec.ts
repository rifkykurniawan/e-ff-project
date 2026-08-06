import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter/playwright";
import { LoginPage } from "../pages/LoginPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { setupCategoriesApiMocks } from "../utils/mockApi";

test.describe("Categories Management E2E Tests", () => {
  let loginPage: LoginPage;
  let categoriesPage: CategoriesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    categoriesPage = new CategoriesPage(page);

    // Call route mocks BEFORE attempting login so auth routes are intercepted
    await setupCategoriesApiMocks(page, [
      { id: "cat-1", name: "Groceries", type: "Expense", created_at: new Date().toISOString() },
      { id: "cat-2", name: "Salary", type: "Income", created_at: new Date().toISOString() },
    ]);

    const testEmail = process.env.TEST_USER_EMAIL || "test@family.com";
    const testPassword = process.env.TEST_USER_PASSWORD || "password123";

    await test.step("Log in as authenticated user", async () => {
      await loginPage.goto();
      await loginPage.login(testEmail, testPassword);
    });
  });

  test(qase(11, "TC-000-CAT-Should load categories page with expected UI components"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Verify page header title and description are visible", async () => {
      await expect(categoriesPage.pageTitle).toBeVisible();
      await expect(categoriesPage.pageSubtitle).toBeVisible();
    });

    await test.step("Verify Add Category button is visible", async () => {
      await expect(categoriesPage.addCategoryButton).toBeVisible();
    });

    await test.step("Verify Expense and Income category section headings are visible", async () => {
      await expect(categoriesPage.expenseCategoriesHeading).toBeVisible();
      await expect(categoriesPage.incomeCategoriesHeading).toBeVisible();
    });

    await test.step("Verify default category items are displayed under respective sections", async () => {
      await expect(categoriesPage.getCategoryItem("Groceries")).toBeVisible();
      await expect(categoriesPage.getCategoryItem("Salary")).toBeVisible();
    });
  });

  test(qase(12, "TC-001-CAT-Should create a new income category successfully"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Open modal and submit a new Income category", async () => {
      await categoriesPage.createCategory("Freelance Income", "Income");
    });

    await test.step("Verify the created Income category item is displayed", async () => {
      const categoryItem = categoriesPage.getCategoryItem("Freelance Income");
      await expect(categoryItem).toBeVisible();
    });
  });

  test(qase(13, "TC-002-CAT-Should create a new expense category successfully"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Open modal and submit a new Expense category", async () => {
      await categoriesPage.createCategory("Dining Out", "Expense");
    });

    await test.step("Verify the created Expense category item is displayed", async () => {
      const categoryItem = categoriesPage.getCategoryItem("Dining Out");
      await expect(categoryItem).toBeVisible();
    });
  });

  test(qase(14, "TC-003-CAT-Should update an existing income category successfully"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Open edit modal for Income category and update details", async () => {
      await categoriesPage.editCategory("Salary", "Bonus Income", "Income");
    });

    await test.step("Verify the updated Income category item is displayed", async () => {
      const updatedItem = categoriesPage.getCategoryItem("Bonus Income");
      await expect(updatedItem).toBeVisible();
    });
  });

  test(qase(15, "TC-004-CAT-Should delete an income category successfully"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Click delete button for Income category and confirm deletion", async () => {
      await categoriesPage.deleteCategory("Salary");
    });

    await test.step("Verify the Income category item is no longer visible", async () => {
      const deletedItem = categoriesPage.getCategoryItem("Salary");
      await expect(deletedItem).not.toBeVisible();
    });
  });

  test(qase(16, "TC-005-CAT-Should update an existing expense category successfully"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Open edit modal for Expense category and update details", async () => {
      await categoriesPage.editCategory("Groceries", "Supermarket Groceries", "Expense");
    });

    await test.step("Verify the updated Expense category item is displayed", async () => {
      const updatedItem = categoriesPage.getCategoryItem("Supermarket Groceries");
      await expect(updatedItem).toBeVisible();
    });
  });

  test(qase(17, "TC-006-CAT-Should delete an expense category successfully"), async () => {
    await test.step("Navigate to the Categories page", async () => {
      await categoriesPage.goto();
    });

    await test.step("Click delete button for Expense category and confirm deletion", async () => {
      await categoriesPage.deleteCategory("Groceries");
    });

    await test.step("Verify the Expense category item is no longer visible", async () => {
      const deletedItem = categoriesPage.getCategoryItem("Groceries");
      await expect(deletedItem).not.toBeVisible();
    });
  });
});
