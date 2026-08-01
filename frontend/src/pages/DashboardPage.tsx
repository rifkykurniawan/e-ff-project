import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { useOutletContext, Link } from "react-router-dom";
import { useAccounts } from "../hooks/useAccounts";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionForm } from "../features/transactions/TransactionForm";
import type { TransactionInput } from "../types/transactions";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  TrendingUp,
  Target,
  X,
  Plus,
  Minus,
  Sparkles,
  PieChart,
  Activity
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, isError, refetch } = useDashboard();
  const { showBalances } = useOutletContext<{ showBalances: boolean }>();

  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { createTransaction, isCreating } = useTransactions();

  // Quick Action Modal State
  const [activeModal, setActiveModal] = useState<"income" | "expense" | "transfer" | null>(null);

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  const formatAmount = (val: number) => {
    return showBalances ? formatCurrency(val) : "Rp ••••••";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-center items-center gap-4 transition-colors duration-200">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Loading family dashboard...</p>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-center items-center gap-4 transition-colors duration-200">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center max-w-md">
          <p className="text-red-400 font-semibold mb-2">Failed to Load Dashboard</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Could not fetch dashboard data. Please check if backend service is running.
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 transition-colors text-white"
          >
            Try Reconnecting
          </button>
        </div>
      </div>
    );
  }

  // Pie/Donut Chart calculations
  const totalBreakdown = dashboardData.total_balance + dashboardData.income_this_month + dashboardData.expense_this_month;
  const balancePercent = totalBreakdown > 0 ? (dashboardData.total_balance / totalBreakdown) * 100 : 0;
  const incomePercent = totalBreakdown > 0 ? (dashboardData.income_this_month / totalBreakdown) * 100 : 0;
  const expensePercent = totalBreakdown > 0 ? (dashboardData.expense_this_month / totalBreakdown) * 100 : 0;

  const r = 38;
  const circ = 2 * Math.PI * r; // ~238.76

  const balanceStrokeLength = (balancePercent * circ) / 100;
  const incomeStrokeLength = (incomePercent * circ) / 100;
  const expenseStrokeLength = (expensePercent * circ) / 100;

  const balanceOffset = 0;
  const incomeOffset = -balanceStrokeLength;
  const expenseOffset = -(balanceStrokeLength + incomeStrokeLength);

  // Helper to translate Transaction Type visually
  const formatTxType = (type: string) => {
    switch (type) {
      case "Income":
        return "Income";
      case "Expense":
        return "Expense";
      case "Transfer":
        return "Transfer";
      default:
        return type;
    }
  };

  const handleTransactionSubmit = async (data: TransactionInput) => {
    try {
      await createTransaction(data);
      setActiveModal(null);
    } catch (error: any) {
      console.error("Failed to save transaction", error);
      alert(error.message || "An error occurred while saving the transaction.");
    }
  };

  return (
    <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-md relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Hello, {user?.first_name || "Sign Outga"} 👋
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
              Here is your financial summary for this month.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveModal("income")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer"
              data-testid="hero-income-button"
            >
              <Plus className="h-4 w-4" /> Income
            </button>
            <button
              onClick={() => setActiveModal("expense")}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-rose-950/20 active:scale-95 cursor-pointer"
              data-testid="hero-expense-button"
            >
              <Minus className="h-4 w-4" /> Expense
            </button>
          </div>
        </div>

        {/* Finance Health (Coming Soon) */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-550/20 dark:border-emerald-500/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden transition-colors duration-200">
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600 dark:text-[#3cd395]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">Financial Health Indicator</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">Analyze your spending habits, debt-to-income ratio, and overall financial safety rating.</p>
            </div>
          </div>
          <span className="shrink-0 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider relative z-10">
            Coming Soon
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Balance</span>
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {formatAmount(dashboardData.total_balance)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Across all accounts</p>
            </div>
          </div>

          {/* Income This Month */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Income This Month</span>
              <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatAmount(dashboardData.income_this_month)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Recorded since start of month</p>
            </div>
          </div>

          {/* Expense This Month */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Expense This Month</span>
              <div className="bg-rose-500/10 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-rose-650 dark:text-rose-400">
                {formatAmount(dashboardData.expense_this_month)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Recorded since start of month</p>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Net Balance</span>
              <div className="bg-violet-500/10 p-2 rounded-lg text-violet-600 dark:text-violet-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold tracking-tight ${dashboardData.net_balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatAmount(dashboardData.net_balance)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Income minus expenses</p>
            </div>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Area (Budget & Transactions) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Allocation Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-200">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                <h2 className="text-lg font-bold tracking-tight">Financial Allocation Breakdown</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                {/* SVG Donut */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r={r}
                      fill="transparent"
                      stroke="#e4e4e7"
                      className="dark:stroke-zinc-800"
                      strokeWidth="10"
                    />
                    {balancePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        className="stroke-blue-500"
                        strokeWidth="10"
                        strokeDasharray={`${balanceStrokeLength} ${circ}`}
                        strokeDashoffset={balanceOffset}
                        strokeLinecap="round"
                      />
                    )}
                    {incomePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        className="stroke-emerald-500"
                        strokeWidth="10"
                        strokeDasharray={`${incomeStrokeLength} ${circ}`}
                        strokeDashoffset={incomeOffset}
                        strokeLinecap="round"
                      />
                    )}
                    {expensePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        className="stroke-rose-500"
                        strokeWidth="10"
                        strokeDasharray={`${expenseStrokeLength} ${circ}`}
                        strokeDashoffset={expenseOffset}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center p-4">
                    <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-bold uppercase tracking-widest">Net Value</span>
                    <span className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight mt-0.5">
                      {formatAmount(dashboardData.net_balance)}
                    </span>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex-1 space-y-4 w-full sm:max-w-xs">
                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Total Balance</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{formatAmount(dashboardData.total_balance)}</p>
                      <p className="text-[10px] text-zinc-500">{balancePercent.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Income</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatAmount(dashboardData.income_this_month)}</p>
                      <p className="text-[10px] text-zinc-500">{incomePercent.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Expense</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{formatAmount(dashboardData.expense_this_month)}</p>
                      <p className="text-[10px] text-zinc-550">{expensePercent.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Budget Summary</h2>
                </div>
                <span className="text-xs text-zinc-550 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium transition-colors duration-200">This Month</span>
              </div>

              <div className="space-y-4">
                {dashboardData.budget_summary.length === 0 ? (
                  <p className="text-sm text-zinc-550 dark:text-zinc-500 text-center py-4">No monthly budget configured yet.</p>
                ) : (
                  dashboardData.budget_summary.map((budget, idx) => {
                    const percent = Math.min((budget.actual / budget.planned) * 100, 100);
                    const isOver = budget.remaining < 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">{budget.category_name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400">
                            {formatAmount(budget.actual)} <span className="text-zinc-400 dark:text-zinc-650">/ {formatAmount(budget.planned)}</span>
                          </span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          {isOver ? (
                            <span className="text-rose-600 dark:text-rose-400 font-medium">Over budget by {formatAmount(Math.abs(budget.remaining))}</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Remaining {formatAmount(budget.remaining)}</span>
                          )}
                          <span className="text-zinc-500">{percent.toFixed(0)}% used</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <ArrowLeftRight className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Recent Transactions</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase font-semibold">
                      <th className="py-3 px-1">Description</th>
                      <th className="py-3 px-1">Type</th>
                      <th className="py-3 px-1">Date</th>
                      <th className="py-3 px-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 text-sm">
                    {dashboardData.recent_transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-zinc-500">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      dashboardData.recent_transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3.5 px-1">
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{tx.description}</p>
                          </td>
                          <td className="py-3.5 px-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                tx.type === "Income"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : tx.type === "Expense"
                                  ? "bg-rose-500/10 text-rose-605 dark:text-rose-400"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {formatTxType(tx.type)}
                            </span>
                          </td>
                          <td className="py-3.5 px-1 text-zinc-500 dark:text-zinc-400 text-xs">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className={`py-3.5 px-1 text-right font-semibold ${
                            tx.type === "Income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : tx.type === "Expense"
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}>
                            {tx.type === "Expense" ? "-" : tx.type === "Income" ? "+" : ""}
                            {formatAmount(tx.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Area (Goals & Quick Actions) */}
          <div className="space-y-6">
            {/* Saving Goals Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <Link 
                  to="/saving-goals" 
                  className="flex items-center gap-2 text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                  data-testid="dashboard-saving-goals-link"
                >
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform" />
                  <h2 className="text-lg font-bold tracking-tight">Saving Goals</h2>
                </Link>
                <Link
                  to="/saving-goals"
                  className="text-xs text-emerald-600 dark:text-emerald-450 hover:underline font-semibold"
                  data-testid="dashboard-view-all-goals-link"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData.saving_goals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20">
                    <Target className="h-7 w-7 text-zinc-400 mb-2" />
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No saving goals configured</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 mb-4 max-w-[200px]">Start planning for your future goals today.</p>
                    <Link
                      to="/saving-goals"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-all shadow-md shadow-emerald-950/10 active:scale-95 cursor-pointer"
                      data-testid="dashboard-create-goal-cta"
                    >
                      Manage Goals
                    </Link>
                  </div>
                ) : (
                  dashboardData.saving_goals.map((goal, idx) => {
                    const percent = goal.progress_percentage;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">{goal.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{percent}%</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-200">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-450 dark:text-zinc-500">
                          <span>
                            {formatAmount(goal.current_amount)}{" "}
                            <span className="text-zinc-400 dark:text-zinc-650">/ {formatAmount(goal.target_amount)}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                <h2 className="text-lg font-bold tracking-tight">Quick Actions</h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => setActiveModal("income")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-3.5 text-sm font-medium transition-all text-left text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:scale-[0.99] cursor-pointer"
                  data-testid="quick-action-income"
                >
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-500">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Income</p>
                    <p className="text-xs text-zinc-500">Add cash income or salary</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("expense")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-3.5 text-sm font-medium transition-all text-left text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:scale-[0.99] cursor-pointer"
                  data-testid="quick-action-expense"
                >
                  <div className="bg-rose-500/10 p-2 rounded-lg text-rose-600 dark:text-rose-500">
                    <Minus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Expense</p>
                    <p className="text-xs text-zinc-500">Add expenses or payments</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("transfer")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-3.5 text-sm font-medium transition-all text-left text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:scale-[0.99] cursor-pointer"
                  data-testid="quick-action-transfer"
                >
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-500">
                    <ArrowLeftRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Transfer Money</p>
                    <p className="text-xs text-zinc-500">Move funds between accounts</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Quick Action Modal Placeholder */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-up transition-colors duration-200 my-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-colors duration-200">
              <h3 className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-2">
                {activeModal === "income" && <Plus className="h-4 w-4 text-emerald-500" />}
                {activeModal === "expense" && <Minus className="h-4 w-4 text-rose-500" />}
                {activeModal === "transfer" && <ArrowLeftRight className="h-4 w-4 text-blue-500" />}
                Log {activeModal === "income" ? "Income" : activeModal === "expense" ? "Expense" : "Transfer"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                data-testid="modal-close-icon"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <TransactionForm
                accounts={accounts}
                categories={categories}
                onSubmit={handleTransactionSubmit}
                isSubmitting={isCreating}
                defaultType={activeModal === "income" ? "Income" : activeModal === "expense" ? "Expense" : "Transfer"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
