import { type Page, type Locator } from "@playwright/test";

export class ReportsPage {
  readonly page: Page;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly exportPdfButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByTestId("month-select");
    this.yearSelect = page.getByTestId("year-select");
    this.exportPdfButton = page.getByTestId("export-pdf-button");
  }

  async goto() {
    await this.page.goto("/reports");
  }

  async selectMonth(month: number | string) {
    await this.monthSelect.selectOption(String(month));
  }

  async selectYear(year: number | string) {
    await this.yearSelect.selectOption(String(year));
  }

  async clickExportPdf() {
    await this.exportPdfButton.click();
  }

  getSummaryCardValue(label: "Total Income" | "Total Outcome" | "Net Cash Flow"): Locator {
    // The structure has a container div containing a header label div and a value div
    return this.page
      .locator("div")
      .filter({ has: this.page.locator(`text=/^${label}$/i`) })
      .locator("div.text-xl, .text-xl")
      .first();
  }

  getCategoryBreakdownRow(categoryName: string): Locator {
    return this.page.locator("div.space-y-1\\.5, div.space-y-1").filter({ hasText: categoryName });
  }

  getTransactionRow(descriptionOrCategory: string): Locator {
    return this.page.locator("tr").filter({ hasText: descriptionOrCategory });
  }
}
