import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useOutletContext } from "react-router-dom";
import { BarChart3, TrendingUp, TrendingDown, Calendar, FileSpreadsheet, FileText, Wallet } from "lucide-react";

export function ReportsPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const { showBalances } = useOutletContext<{ showBalances: boolean }>();

  // Date boundaries
  const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  // Fetch all transactions for the selected month
  const { transactions, isLoading } = useTransactions({
    startDate,
    endDate
  });

  const { categories } = useCategories();

  // Filter transactions
  const incomes = transactions.filter((t) => t.type === "Income");
  const expenses = transactions.filter((t) => t.type === "Expense");

  // Sums
  const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const netFlow = totalIncome - totalExpense;

  // Group by category helper
  const groupByCategory = (txList: typeof transactions) => {
    const grouped = txList.reduce((acc, t) => {
      const catName = t.categories?.name || "Uncategorized";
      acc[catName] = (acc[catName] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const incomeCategories = groupByCategory(incomes);
  const expenseCategories = groupByCategory(expenses);

  const formatAmount = (val: number) => {
    return showBalances 
      ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val)
      : "Rp ••••••";
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 7 }, (_, i) => currentDate.getFullYear() - 5 + i);

  const handleExport = (type: "excel" | "pdf") => {
    alert(`Exporting monthly report as ${type.toUpperCase()} is scheduled for the next release phase.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            Monthly Reports
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Analyze your family income, outcomes, and category breakdowns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Month Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {/* Year Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Income</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1">{formatAmount(totalIncome)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl text-rose-600 dark:text-rose-400">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Outcome</div>
            <div className="text-xl font-bold text-red-500 mt-1">{formatAmount(totalExpense)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${netFlow >= 0 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Net Cash Flow</div>
            <div className={`text-xl font-bold mt-1 ${netFlow >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {formatAmount(netFlow)}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">Loading monthly report...</div>
      ) : (
        <>
          {/* Visual Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income by Category */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Income by Category</h3>
              {incomeCategories.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No income logged in this month.</p>
              ) : (
                <div className="space-y-4">
                  {incomeCategories.map((c) => {
                    const percentage = totalIncome > 0 ? (c.amount / totalIncome) * 100 : 0;
                    return (
                      <div key={c.name} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-zinc-700 dark:text-zinc-300">{c.name}</span>
                          <span className="text-zinc-900 dark:text-white">
                            {formatAmount(c.amount)} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Outcome by Category */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Outcome by Category</h3>
              {expenseCategories.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No outcome logged in this month.</p>
              ) : (
                <div className="space-y-4">
                  {expenseCategories.map((c) => {
                    const percentage = totalExpense > 0 ? (c.amount / totalExpense) * 100 : 0;
                    return (
                      <div key={c.name} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-zinc-700 dark:text-zinc-300">{c.name}</span>
                          <span className="text-zinc-900 dark:text-white">
                            {formatAmount(c.amount)} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Transactions Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Transactions */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Income Transactions</h3>
              {incomes.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No income transactions in this period.</p>
              ) : (
                <div className="overflow-x-auto -mx-6 max-h-96 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-250 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs font-semibold text-zinc-500 uppercase sticky top-0 backdrop-blur z-10">
                        <th className="p-4 pl-6 bg-zinc-50/90 dark:bg-zinc-900/90">Date</th>
                        <th className="p-4 bg-zinc-50/90 dark:bg-zinc-900/90">Category</th>
                        <th className="p-4 bg-zinc-50/90 dark:bg-zinc-900/90">Account</th>
                        <th className="p-4 text-right pr-6 bg-zinc-50/90 dark:bg-zinc-900/90">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                      {incomes.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                          <td className="p-4 pl-6 text-xs text-zinc-500 whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </td>
                          <td className="p-4 text-sm text-zinc-900 dark:text-white font-medium">
                            {t.categories?.name || "Uncategorized"}
                          </td>
                          <td className="p-4 text-xs text-zinc-505 dark:text-zinc-500">
                            {t.destination_accounts?.name || "-"}
                          </td>
                          <td className="p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-right pr-6 whitespace-nowrap">
                            +{formatAmount(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Outcome Transactions */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Outcome Transactions</h3>
              {expenses.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No outcome transactions in this period.</p>
              ) : (
                <div className="overflow-x-auto -mx-6 max-h-96 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-250 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs font-semibold text-zinc-500 uppercase sticky top-0 backdrop-blur z-10">
                        <th className="p-4 pl-6 bg-zinc-50/90 dark:bg-zinc-900/90">Date</th>
                        <th className="p-4 bg-zinc-50/90 dark:bg-zinc-900/90">Category</th>
                        <th className="p-4 bg-zinc-50/90 dark:bg-zinc-900/90">Account</th>
                        <th className="p-4 text-right pr-6 bg-zinc-50/90 dark:bg-zinc-900/90">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                      {expenses.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                          <td className="p-4 pl-6 text-xs text-zinc-500 whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </td>
                          <td className="p-4 text-sm text-zinc-900 dark:text-white font-medium">
                            {t.categories?.name || "Uncategorized"}
                          </td>
                          <td className="p-4 text-xs text-zinc-505 dark:text-zinc-500">
                            {t.source_accounts?.name || "-"}
                          </td>
                          <td className="p-4 text-sm font-semibold text-red-600 dark:text-red-400 text-right pr-6 whitespace-nowrap">
                            -{formatAmount(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Export Action Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Export Monthly Data</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Generate spreadsheet or document versions of this monthly summary.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-3.5 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-500" /> Export Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-3.5 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-red-650 dark:text-red-500" /> Export PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
