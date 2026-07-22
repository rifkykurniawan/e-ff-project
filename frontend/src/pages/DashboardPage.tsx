import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  TrendingUp,
  Target,
  LogOut,
  X,
  Plus,
  Minus,
  Sparkles,
  PieChart
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: dashboardData, isLoading, isError, refetch } = useDashboard();
  const navigate = useNavigate();

  // Quick Action Modal State
  const [activeModal, setActiveModal] = useState<"income" | "expense" | "transfer" | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-zinc-400 font-medium">Loading family dashboard...</p>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center gap-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center max-w-md">
          <p className="text-red-400 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-zinc-400 mb-4">
            Could not fetch dashboard metrics. Please check that the backend service is running.
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-505 transition-colors"
          >
            Retry Connection
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5 text-emerald-500">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Family Finance</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-zinc-200">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-zinc-500">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 px-3 py-1.5 text-sm font-medium transition-colors text-zinc-300 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.first_name || "Family"} 👋
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Here is your family's current financial snapshot for this month.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveModal("income")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-emerald-950/20 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Log Income
            </button>
            <button
              onClick={() => setActiveModal("expense")}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-95 border border-zinc-700"
            >
              <Minus className="h-4 w-4" /> Log Expense
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Balance</span>
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-white">
                {formatCurrency(dashboardData.total_balance)}
              </p>
              <p className="text-xs text-zinc-500">Across all accounts</p>
            </div>
          </div>

          {/* Income This Month */}
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Income This Month</span>
              <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-emerald-400">
                {formatCurrency(dashboardData.income_this_month)}
              </p>
              <p className="text-xs text-zinc-500">Logged since month start</p>
            </div>
          </div>

          {/* Expense This Month */}
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Expense This Month</span>
              <div className="bg-rose-500/10 p-2 rounded-lg text-rose-400">
                <ArrowDownRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-rose-400">
                {formatCurrency(dashboardData.expense_this_month)}
              </p>
              <p className="text-xs text-zinc-500">Logged since month start</p>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Net Balance</span>
              <div className="bg-violet-500/10 p-2 rounded-lg text-violet-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold tracking-tight ${dashboardData.net_balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {formatCurrency(dashboardData.net_balance)}
              </p>
              <p className="text-xs text-zinc-500">Income minus expenses</p>
            </div>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Area (Budget & Transactions) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Allocation Chart Card */}
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-500" />
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
                      stroke="#27272a"
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
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Net Value</span>
                    <span className="text-sm font-extrabold text-white leading-tight mt-0.5">
                      {formatCurrency(dashboardData.net_balance)}
                    </span>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex-1 space-y-4 w-full sm:max-w-xs">
                  <div className="flex justify-between items-center bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-semibold text-zinc-300">Total Balance</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{formatCurrency(dashboardData.total_balance)}</p>
                      <p className="text-[10px] text-zinc-500">{balancePercent.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-semibold text-zinc-300">Incomes</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">{formatCurrency(dashboardData.income_this_month)}</p>
                      <p className="text-[10px] text-zinc-500">{incomePercent.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                      <span className="text-xs font-semibold text-zinc-300">Expenses</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-400">{formatCurrency(dashboardData.expense_this_month)}</p>
                      <p className="text-[10px] text-zinc-500">{expensePercent.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Summary Card */}
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Budget Summary</h2>
                </div>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full font-medium">This Month</span>
              </div>

              <div className="space-y-4">
                {dashboardData.budget_summary.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">No monthly budgets configured.</p>
                ) : (
                  dashboardData.budget_summary.map((budget, idx) => {
                    const percent = Math.min((budget.actual / budget.planned) * 100, 100);
                    const isOver = budget.remaining < 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-zinc-200">{budget.category_name}</span>
                          <span className="text-zinc-400">
                            {formatCurrency(budget.actual)} <span className="text-zinc-600">/ {formatCurrency(budget.planned)}</span>
                          </span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          {isOver ? (
                            <span className="text-rose-400 font-medium">Over by {formatCurrency(Math.abs(budget.remaining))}</span>
                          ) : (
                            <span className="text-emerald-400 font-medium">{formatCurrency(budget.remaining)} remaining</span>
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
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Recent Transactions</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase font-semibold">
                      <th className="py-3 px-1">Description</th>
                      <th className="py-3 px-1">Type</th>
                      <th className="py-3 px-1">Date</th>
                      <th className="py-3 px-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50 text-sm">
                    {dashboardData.recent_transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-zinc-500">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      dashboardData.recent_transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-850/30 transition-colors">
                          <td className="py-3.5 px-1">
                            <p className="font-semibold text-zinc-200">{tx.description}</p>
                          </td>
                          <td className="py-3.5 px-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                tx.type === "Income"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : tx.type === "Expense"
                                  ? "bg-rose-500/10 text-rose-400"
                                  : "bg-blue-500/10 text-blue-400"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-1 text-zinc-400 text-xs">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className={`py-3.5 px-1 text-right font-semibold ${
                            tx.type === "Income"
                              ? "text-emerald-400"
                              : tx.type === "Expense"
                              ? "text-rose-400"
                              : "text-blue-400"
                          }`}>
                            {tx.type === "Expense" ? "-" : tx.type === "Income" ? "+" : ""}
                            {formatCurrency(tx.amount)}
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
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Saving Goals</h2>
                </div>
              </div>

              <div className="space-y-4">
                {dashboardData.saving_goals.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">No saving goals specified.</p>
                ) : (
                  dashboardData.saving_goals.map((goal, idx) => (
                    <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-zinc-200">{goal.name}</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          {goal.progress_percentage}%
                        </span>
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold tracking-tight">Quick Actions</h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => setActiveModal("income")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-950 hover:bg-zinc-850 p-3.5 text-sm font-medium transition-all text-left text-zinc-200 border border-zinc-800 hover:border-zinc-700/80 active:scale-[0.99]"
                >
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Log Income</p>
                    <p className="text-xs text-zinc-500">Add cash inflows or salary</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("expense")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-950 hover:bg-zinc-850 p-3.5 text-sm font-medium transition-all text-left text-zinc-200 border border-zinc-800 hover:border-zinc-700/80 active:scale-[0.99]"
                >
                  <div className="bg-rose-500/10 p-2 rounded-lg text-rose-500">
                    <Minus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Log Expense</p>
                    <p className="text-xs text-zinc-500">Add spending or payments</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("transfer")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-950 hover:bg-zinc-850 p-3.5 text-sm font-medium transition-all text-left text-zinc-200 border border-zinc-800 hover:border-zinc-700/80 active:scale-[0.99]"
                >
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                    <ArrowLeftRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Transfer Money</p>
                    <p className="text-xs text-zinc-500">Move funds between accounts</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Action Modal Placeholder */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="font-bold text-white capitalize flex items-center gap-2">
                {activeModal === "income" && <Plus className="h-4 w-4 text-emerald-500" />}
                {activeModal === "expense" && <Minus className="h-4 w-4 text-rose-500" />}
                {activeModal === "transfer" && <ArrowLeftRight className="h-4 w-4 text-blue-500" />}
                Log {activeModal}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                You've triggered the <strong className="text-emerald-400 capitalize">{activeModal}</strong> form action.
              </p>
              <div className="rounded-lg bg-zinc-950 border border-zinc-850 p-4 space-y-2">
                <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest block">Coming Soon</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Interactive transaction entry forms and dynamic balance calculations will be implemented in the next feature phase (Milestone 3: Core Transaction Ledger).
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-zinc-800 hover:bg-zinc-700/80 text-sm text-white font-semibold py-2.5 rounded-xl transition-all border border-zinc-700/60"
              >
                Dismiss Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
