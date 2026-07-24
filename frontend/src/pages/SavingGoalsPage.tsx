import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, Target, Award } from "lucide-react";
import { useSavingGoals } from "../hooks/useSavingGoals";
import { Modal } from "../components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingGoalSchema, type SavingGoalInput, type SavingGoal } from "../types/savingGoals";

export function SavingGoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  const { savingGoals, isLoading, createSavingGoal, updateSavingGoal, deleteSavingGoal } = useSavingGoals();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SavingGoalInput>({
    resolver: zodResolver(savingGoalSchema) as any,
    defaultValues: {
      name: "",
      target_amount: 0,
      current_amount: 0,
      target_date: "",
      notes: "",
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
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
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
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">{goal.name}</h3>
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
                        Rp {goal.current_amount.toLocaleString()} / Rp {goal.target_amount.toLocaleString()}
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
                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => handleOpenEditModal(goal)}
                      className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg transition-all"
                      title="Edit Goal"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
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
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
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
              {errors.target_amount && <p className="mt-1 text-xs text-red-500">{errors.target_amount.message}</p>}
            </div>

            {/* Current Amount */}
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
              {errors.current_amount && <p className="mt-1 text-xs text-red-500">{errors.current_amount.message}</p>}
            </div>
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
            {errors.target_date && <p className="mt-1 text-xs text-red-500">{errors.target_date.message}</p>}
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
    </div>
  );
}
