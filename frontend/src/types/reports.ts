export interface DashboardSavingGoal {
  name: string;
  progress_percentage: number;
}

export interface DashboardTransaction {
  id: string;
  description: string;
  amount: number;
  type: "Income" | "Expense" | "Transfer";
  date: string;
}

export interface DashboardBudget {
  category_name: string;
  planned: number;
  actual: number;
  remaining: number;
}

export interface DashboardData {
  total_balance: number;
  income_this_month: number;
  expense_this_month: number;
  net_balance: number;
  recent_transactions: DashboardTransaction[];
  saving_goals: DashboardSavingGoal[];
  budget_summary: DashboardBudget[];
}
