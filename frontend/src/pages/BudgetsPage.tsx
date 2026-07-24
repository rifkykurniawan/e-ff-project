import { useState } from "react";
import { Edit2, PieChart, Info, AlertTriangle } from "lucide-react";
import { useBudgets } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { Modal } from "../components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, type BudgetInput, type Budget } from "../types/budgets";
import { useOutletContext } from "react-router-dom";

export function BudgetsPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [editingBudget, setEditingBudget] = useState<{ categoryId: string; categoryName: string; budget?: Budget } | null>(null);
  const { showBalances } = useOutletContext<{ showBalances: boolean }>();

  const formatAmount = (val: number) => {
    return showBalances ? `Rp ${val.toLocaleString()}` : "Rp ••••••";
  };

  const formatRemaining = (val: number) => {
    if (!showBalances) return "Rp ••••••";
    return `${val < 0 ? "-" : ""}Rp ${Math.abs(val).toLocaleString()}`;
  };

  const { categories } = useCategories();
  const { budgets, isLoading: isBudgetsLoading, createBudget, updateBudget } = useBudgets(selectedYear, selectedMonth);

  // Define date range for transactions query
  const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { transactions, isLoading: isTransactionsLoading } = useTransactions({
    startDate,
    endDate,
    type: "Expense"
  });

  const expenseCategories = categories.filter(c => c.type === "Expense");

  // Sum actual spending per category
  const actualSpendingMap = expenseCategories.reduce((acc, cat) => {
    const total = transactions
      .filter(t => t.category_id === cat.id && t.type === "Expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    acc[cat.id] = total;
    return acc;
  }, {} as Record<string, number>);

  // React Hook Form for Set/Edit Budget Modal
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      category_id: "",
      year: selectedYear,
      month: selectedMonth,
      planned_amount: 0,
    }
  });

  const handleOpenEdit = (categoryId: string, categoryName: string) => {
    const existing = budgets.find(b => b.category_id === categoryId);
    setEditingBudget({
      categoryId,
      categoryName,
      budget: existing
    });
    
    reset({
      category_id: categoryId,
      year: selectedYear,
      month: selectedMonth,
      planned_amount: existing ? existing.planned_amount : 0,
    });
  };

  const handleCloseEdit = () => {
    setEditingBudget(null);
  };

  const onFormSubmit = async (data: BudgetInput) => {
    try {
      if (editingBudget?.budget) {
        await updateBudget({
          id: editingBudget.budget.id,
          input: { planned_amount: data.planned_amount }
        });
      } else {
        await createBudget(data);
      }
      handleCloseEdit();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save budget.");
    }
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

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const totalPlanned = budgets.reduce((sum, b) => sum + Number(b.planned_amount), 0);
  const totalActual = Object.values(actualSpendingMap).reduce((sum, val) => sum + val, 0);
  const totalRemaining = totalPlanned - totalActual;

  const isLoading = isBudgetsLoading || isTransactionsLoading;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <PieChart className="h-6 w-6 text-emerald-500" />
            Monthly Budget
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Set monthly category spending limits and monitor actual payouts.</p>
        </div>
        
        {/* Month/Year selectors */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Month Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {months.map(m => (
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
              className="w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {years.map(y => (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Planned Budget</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{formatAmount(totalPlanned)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Spent</div>
          <div className="text-2xl font-bold text-red-500 mt-1">{formatAmount(totalActual)}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Remaining Budget</div>
          <div className={`text-2xl font-bold mt-1 ${totalRemaining < 0 ? "text-red-500" : "text-emerald-500"}`}>
            {formatRemaining(totalRemaining)}
          </div>
        </div>
      </div>

      {/* Main Budget Sheet / Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">Loading budget sheet...</div>
      ) : expenseCategories.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No Expense Categories Found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Please define some expense categories on the Categories page first to schedule monthly budgets.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Category</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-right">Planned Limit</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-right">Actual Spent</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-right">Remaining Balance</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Progress Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {expenseCategories.map((cat) => {
                const existingBudget = budgets.find(b => b.category_id === cat.id);
                const planned = existingBudget ? Number(existingBudget.planned_amount) : 0;
                const actual = actualSpendingMap[cat.id] || 0;
                const remaining = planned - actual;
                
                // Progress calculations
                const progressPercentage = planned > 0 ? Math.min((actual / planned) * 100, 100) : 0;
                const isOverBudget = remaining < 0;

                return (
                  <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    {/* Category Name */}
                    <td className="p-4 text-sm font-semibold text-zinc-900 dark:text-white align-top">
                      {cat.name}
                    </td>
                    
                    {/* Planned Limit */}
                    <td className="p-4 text-sm text-zinc-900 dark:text-zinc-300 text-right font-medium align-top">
                      {existingBudget ? formatAmount(planned) : (
                        <span className="text-zinc-400 dark:text-zinc-600 italic">Not set</span>
                      )}
                    </td>

                    {/* Actual Spent */}
                    <td className="p-4 text-sm text-zinc-900 dark:text-zinc-300 text-right font-medium align-top">
                      {formatAmount(actual)}
                    </td>

                    {/* Remaining */}
                    <td className={`p-4 text-sm text-right font-semibold align-top ${isOverBudget ? "text-red-500" : "text-zinc-900 dark:text-zinc-300"}`}>
                      {formatRemaining(remaining)}
                    </td>

                    {/* Progress Bar & Badges */}
                    <td className="p-4 align-top">
                      {planned > 0 ? (
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-zinc-500">{progressPercentage.toFixed(0)}% used</span>
                            {isOverBudget && (
                              <span className="text-red-500 flex items-center gap-0.5 font-medium">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Overspent!
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                isOverBudget ? "bg-red-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400 dark:text-zinc-600">No budget planned</span>
                      )}
                    </td>

                    {/* Action button */}
                    <td className="p-4 text-center align-top">
                      <button
                        onClick={() => handleOpenEdit(cat.id, cat.name)}
                        className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors inline-flex"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Budget Modal */}
      <Modal
        isOpen={editingBudget !== null}
        onClose={handleCloseEdit}
        title={`${editingBudget?.budget ? "Edit" : "Set"} Budget for ${editingBudget?.categoryName}`}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Planned Budget Amount (Rp)
            </label>
            <input
              type="number"
              {...register("planned_amount")}
              className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.planned_amount ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
              }`}
            />
            {errors.planned_amount && <p className="mt-1 text-xs text-red-500">{errors.planned_amount.message}</p>}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              Save Budget
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
