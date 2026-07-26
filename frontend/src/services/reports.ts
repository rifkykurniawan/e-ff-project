import type { EnvelopeResponse } from "../types/auth";
import type { DashboardData, DashboardBudget, DashboardSavingGoal, DashboardTransaction } from "../types/reports";
import { accountsService } from "./accountsService";
import { savingGoalsService } from "./savingGoalsService";
import { budgetsService } from "./budgetsService";
import { transactionsService } from "./transactionsService";

export const reportsService = {
  getDashboardData: async (): Promise<EnvelopeResponse<DashboardData>> => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Define date range for transactions query (current month)
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      // Fetch all required data in parallel
      const [accounts, savingGoals, budgets, currentMonthTransactions] = await Promise.all([
        accountsService.getAccounts(),
        savingGoalsService.getSavingGoals(),
        budgetsService.getBudgets(year, month),
        transactionsService.getTransactions({ startDate, endDate })
      ]);

      // 1. Total Balance across all accounts
      const total_balance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

      // 2. Income and Expense this month
      const income_this_month = currentMonthTransactions
        .filter((t) => t.type === "Income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense_this_month = currentMonthTransactions
        .filter((t) => t.type === "Expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const net_balance = income_this_month - expense_this_month;

      // 3. Recent Transactions (limit to 5 from current month)
      const recent_transactions: DashboardTransaction[] = currentMonthTransactions
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          description: t.description,
          amount: Number(t.amount),
          type: t.type,
          date: t.date
        }));

      // 4. Saving Goals Progress
      const saving_goals: DashboardSavingGoal[] = savingGoals.map((goal) => ({
        name: goal.name,
        progress_percentage: goal.target_amount > 0 
          ? Math.min(Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100), 100)
          : 0
      }));

      // 5. Budget Summary
      const budget_summary: DashboardBudget[] = budgets.map((b) => {
        // b.categories can be object or array depending on relation mapping, in budgetsService it's:
        // .select('*, categories(name, type)')
        // So b.categories is either an object or null
        const categoryName = (b as any).categories?.name || "Unknown Category";
        const actual = currentMonthTransactions
          .filter((t) => t.category_id === b.category_id && t.type === "Expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const planned = Number(b.planned_amount);

        return {
          category_name: categoryName,
          planned,
          actual,
          remaining: planned - actual
        };
      });

      return {
        success: true,
        message: "Dashboard data loaded successfully",
        data: {
          total_balance,
          income_this_month,
          expense_this_month,
          net_balance,
          recent_transactions,
          saving_goals,
          budget_summary
        }
      };
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
};
