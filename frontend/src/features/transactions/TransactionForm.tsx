import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { transactionSchema, transactionTypes, type TransactionInput } from "../../types/transactions";
import type { Account } from "../../types/accounts";
import type { Category } from "../../types/categories";

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: TransactionInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function TransactionForm({ accounts, categories, onSubmit, isSubmitting }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      description: "",
      amount: undefined as any,
      type: "Expense",
      date: new Date().toISOString().split("T")[0],
      source_account_id: "",
      destination_account_id: "",
      category_id: "",
      notes: "",
    },
  });

  const selectedType = watch("type");

  // Reset fields when type changes to satisfy validation rules
  useEffect(() => {
    if (selectedType === "Income") {
      setValue("source_account_id", null);
      setValue("category_id", categories.find(c => c.type === "Income")?.id || "");
    } else if (selectedType === "Expense") {
      setValue("destination_account_id", null);
      setValue("category_id", categories.find(c => c.type === "Expense")?.id || "");
    } else if (selectedType === "Transfer") {
      setValue("category_id", null);
    }
  }, [selectedType, setValue, categories]);

  // Filter categories by transaction type
  const filteredCategories = categories.filter((cat) => cat.type === selectedType);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Type
        </label>
        <div className="flex gap-2">
          {transactionTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setValue("type", t, { shouldValidate: true })}
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                selectedType === t
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Description
        </label>
        <input
          type="text"
          {...register("description")}
          placeholder="e.g., Weekly groceries, Salary deposit"
          className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
            errors.description ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
          }`}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 sm:text-sm">
            Rp
          </span>
          <input
            type="number"
            {...register("amount")}
            placeholder="0"
            className={`w-full rounded-lg border bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.amount ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
            }`}
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Date
        </label>
        <input
          type="date"
          {...register("date")}
          className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
            errors.date ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
          }`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
      </div>

      {/* Source Account (Expense / Transfer) */}
      {(selectedType === "Expense" || selectedType === "Transfer") && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Source Account
          </label>
          <select
            {...register("source_account_id")}
            className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.source_account_id ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
            }`}
          >
            <option value="">Select source account...</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (Rp {acc.balance.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.source_account_id && <p className="mt-1 text-xs text-red-500">{errors.source_account_id.message}</p>}
        </div>
      )}

      {/* Destination Account (Income / Transfer) */}
      {(selectedType === "Income" || selectedType === "Transfer") && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Destination Account
          </label>
          <select
            {...register("destination_account_id")}
            className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.destination_account_id ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
            }`}
          >
            <option value="">Select destination account...</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (Rp {acc.balance.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.destination_account_id && <p className="mt-1 text-xs text-red-500">{errors.destination_account_id.message}</p>}
        </div>
      )}

      {/* Category (Income / Expense) */}
      {selectedType !== "Transfer" && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Category
          </label>
          <select
            {...register("category_id")}
            className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.category_id ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
            }`}
          >
            <option value="">Select category...</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register("notes")}
          placeholder="Add extra details..."
          rows={3}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Logging..." : "Log Transaction"}
        </button>
      </div>
    </form>
  );
}
