import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, Target, Award, PiggyBank } from "lucide-react";
import { useSavingGoals } from "../hooks/useSavingGoals";
import { Modal } from "../components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingGoalSchema, type SavingGoalInput, type SavingGoal } from "../types/savingGoals";
import { useAccounts } from "../hooks/useAccounts";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";

const addSavingsSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  source_account_id: z.string().uuid("Please select a valid source account"),
  category_id: z.string().uuid("Please select a valid category").optional().nullable(),
  date: z.string().min(1, "Date is required"),
});
type AddSavingsInput = z.infer<typeof addSavingsSchema>;

export function SavingGoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [addingSavingsGoal, setAddingSavingsGoal] = useState<SavingGoal | null>(null);
  const { showBalances } = useOutletContext<{ showBalances: boolean }>();

  const formatAmount = (val: number) => {
    return showBalances ? `Rp ${val.toLocaleString()}` : "Rp ••••••";
  };

  const { savingGoals, isLoading, createSavingGoal, updateSavingGoal, deleteSavingGoal } = useSavingGoals();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { createTransaction, isCreating: isLoggingTransaction } = useTransactions();

  // Local copies of addingSavingsGoal fields to avoid TS null narrowing issues in JSX
  const addingGoalName = addingSavingsGoal?.name || "";
  const addingGoalTarget = addingSavingsGoal?.target_amount ?? 0;
  const addingGoalCurrent = addingSavingsGoal?.current_amount ?? 0;

  // Form for Set/Edit Goal
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SavingGoalInput>({
    resolver: zodResolver(savingGoalSchema) as any,
    defaultValues: {
      name: "",
      target_amount: 0,
      current_amount: 0,
      target_date: "",
      notes: "",
      account_id: "",
    }
  });

  const watchedAccountId = watch("account_id");

  // Form for Add Savings Modal
  const {
    register: registerSavings,
    handleSubmit: handleSubmitSavings,
    formState: { errors: savingsErrors },
    reset: resetSavings,
  } = useForm<AddSavingsInput>({
    resolver: zodResolver(addSavingsSchema) as any,
    defaultValues: {
      amount: undefined as any,
      source_account_id: "",
      category_id: "",
      date: new Date().toISOString().split("T")[0]
    }
  });

  const handleOpenAddModal = () => {
    setEditingGoal(null);
    reset({
      name: "",
      target_amount: 0,
      current_amount: 0,
      target_date: "",
      notes: "",
      account_id: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: SavingGoal) => {
    setEditingGoal(goal);
    reset({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date || "",
      notes: goal.notes || "",
      account_id: goal.account_id || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleOpenAddSavings = (goal: SavingGoal) => {
    setAddingSavingsGoal(goal);
    const matchedCategory = categories.find(
      (c) => c.type === "Expense" && 
      (c.name.toLowerCase().includes("saving") || c.name.toLowerCase().includes("tabungan"))
    );
    resetSavings({
      amount: undefined as any,
      source_account_id: "",
      category_id: matchedCategory?.id || categories.find(c => c.type === "Expense")?.id || "",
      date: new Date().toISOString().split("T")[0]
    });
  };

  const handleCloseSavingsModal = () => {
    setAddingSavingsGoal(null);
    resetSavings();
  };

  const onSavingsFormSubmit = async (data: AddSavingsInput) => {
    if (!addingSavingsGoal) return;
    
    const potentialNewAmount = Number(addingSavingsGoal.current_amount) + Number(data.amount);
    if (potentialNewAmount > Number(addingSavingsGoal.target_amount)) {
      alert("Added amount exceeds target goal limit.");
      return;
    }

    try {
      if (addingSavingsGoal.account_id) {
        // If the saving goal has its own account, log a Transfer from source to the saving goal's account
        await createTransaction({
          description: `Savings: ${addingSavingsGoal.name}`,
          amount: data.amount,
          type: "Transfer",
          date: data.date,
          source_account_id: data.source_account_id,
          destination_account_id: addingSavingsGoal.account_id,
          notes: `Savings contribution to goal "${addingSavingsGoal.name}"`
        });
      } else {
        // Fallback: update saving goal directly and log as Expense
        await updateSavingGoal({
          id: addingSavingsGoal.id,
          input: {
            current_amount: potentialNewAmount
          }
        });

        await createTransaction({
          description: `Savings: ${addingSavingsGoal.name}`,
          amount: data.amount,
          type: "Expense",
          date: data.date,
          source_account_id: data.source_account_id,
          category_id: data.category_id || undefined,
          notes: `Savings contribution to goal "${addingSavingsGoal.name}"`
        });
      }

      handleCloseSavingsModal();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add savings.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this saving goal?")) {
      try {
        await deleteSavingGoal(id);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to delete saving goal.");
      }
    }
  };

  const onFormSubmit = async (data: SavingGoalInput) => {
    try {
      if (editingGoal) {
        await updateSavingGoal({
          id: editingGoal.id,
          input: data
        });
      } else {
        await createSavingGoal(data);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save saving goal.");
    }
  };


  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-emerald-500" />
            Saving Goals
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Set, track, and manage your family's savings targets.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          data-testid="add-goal-button"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </button>
      </div>

      {/* Main content grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">Loading saving goals...</div>
      ) : savingGoals.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No Saving Goals Found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            You don't have any savings targets configured. Let's create your first goal!
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingGoals.map((goal) => {
            const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            const isCompleted = progress >= 100;

            return (
              <div 
                key={goal.id} 
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group"
              >
                {/* Completion Badge Overlay */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 font-semibold rounded-bl-lg uppercase tracking-wider">
                    Completed
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">{goal.name}</h3>
                      {goal.accounts && (
                        <span className="inline-block mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Account: {goal.accounts.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {goal.target_date && (
                    <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 mb-4">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Target: {new Date(goal.target_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  )}

                  {goal.notes && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-5 h-10">{goal.notes}</p>
                  )}
                </div>

                <div>
                  {/* Progress Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-end text-xs font-semibold">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {formatAmount(goal.current_amount)} / {formatAmount(goal.target_amount)}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? "bg-emerald-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-end items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => handleOpenAddSavings(goal)}
                      disabled={isCompleted}
                      data-testid="add-savings-button"
                      className="flex-1 mr-2 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      <PiggyBank className="h-3.5 w-3.5" />
                      Add Savings
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(goal)}
                      data-testid="edit-goal-button"
                      className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg transition-all cursor-pointer"
                      title="Edit Goal"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      data-testid="delete-goal-button"
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingGoal ? "Edit Saving Goal" : "Create Saving Goal"}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Goal Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g., Vacation fund, Downpayment"
              className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
              }`}
            />
            {errors.name?.message && <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>}
          </div>

          {/* Associated Account */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Associated Account (e.g. BCA, BRI, Seabank)
            </label>
            <div className="relative">
              <select
                {...register("account_id")}
                className={`w-full appearance-none rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.account_id ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
                }`}
              >
                <option value="">No account (manual balance tracking)</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type}) - Rp {acc.balance.toLocaleString()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            {errors.account_id?.message && <p className="mt-1 text-xs text-red-500">{errors.account_id?.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Target Amount (Rp)
              </label>
              <input
                type="number"
                {...register("target_amount")}
                placeholder="0"
                className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.target_amount ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
                }`}
              />
              {errors.target_amount?.message && <p className="mt-1 text-xs text-red-500">{errors.target_amount?.message}</p>}
            </div>

            {/* Current Amount */}
            {!watchedAccountId && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Current Amount (Rp)
                </label>
                <input
                  type="number"
                  {...register("current_amount")}
                  placeholder="0"
                  className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.current_amount ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
                  }`}
                />
                {errors.current_amount?.message && <p className="mt-1 text-xs text-red-500">{errors.current_amount?.message}</p>}
              </div>
            )}
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Target Date (Optional)
            </label>
            <input
              type="date"
              {...register("target_date")}
              className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.target_date ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
              }`}
            />
            {errors.target_date?.message && <p className="mt-1 text-xs text-red-500">{errors.target_date?.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              placeholder="Provide context or details about this saving goal..."
              rows={3}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              {editingGoal ? "Save Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Savings Modal */}
      <Modal
        isOpen={addingSavingsGoal !== null}
        onClose={handleCloseSavingsModal}
        title={addingSavingsGoal ? `Add Savings to ${addingGoalName}` : "Add Savings"}
      >
        <form onSubmit={handleSubmitSavings(onSavingsFormSubmit)} className="space-y-4">
          {/* Target Info */}
          {addingSavingsGoal && (
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-505 dark:text-zinc-500 space-y-1">
              <div className="flex justify-between">
                <span>Target Amount:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatAmount(addingGoalTarget)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Amount:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatAmount(addingGoalCurrent)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-1.5 mt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Remaining to Save:</span>
                <span>{formatAmount(addingGoalTarget - addingGoalCurrent)}</span>
              </div>
            </div>
          )}

          {/* Amount to Save */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Amount to Add (Rp)
            </label>
            <input
              type="number"
              {...registerSavings("amount")}
              placeholder="e.g., 500000"
              className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                savingsErrors.amount ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
              }`}
            />
            {savingsErrors.amount?.message && <p className="mt-1 text-xs text-red-500">{savingsErrors.amount?.message}</p>}
          </div>

          {/* Source Account */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Source Account (to Deduct From)
            </label>
            <div className="relative">
              <select
                {...registerSavings("source_account_id")}
                className={`w-full appearance-none rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  savingsErrors.source_account_id ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
                }`}
              >
                <option value="">Select source account...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (Rp {acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
             {savingsErrors.source_account_id?.message && <p className="mt-1 text-xs text-red-500">{savingsErrors.source_account_id?.message}</p>}
          </div>

          {/* Expense Category (Only for manual savings without associated account) */}
          {!addingSavingsGoal?.account_id && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Expense Category
              </label>
              <div className="relative">
                <select
                  {...registerSavings("category_id")}
                  className={`w-full appearance-none rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    savingsErrors.category_id ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
                  }`}
                >
                  <option value="">Select category...</option>
                  {categories.filter(c => c.type === "Expense").map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
               {savingsErrors.category_id?.message && <p className="mt-1 text-xs text-red-500">{savingsErrors.category_id?.message}</p>}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Date
            </label>
            <input
              type="date"
              {...registerSavings("date")}
              className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                savingsErrors.date ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
              }`}
            />
             {savingsErrors.date?.message && <p className="mt-1 text-xs text-red-500">{savingsErrors.date?.message}</p>}
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoggingTransaction}
              className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isLoggingTransaction ? "Adding Savings..." : "Confirm & Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
