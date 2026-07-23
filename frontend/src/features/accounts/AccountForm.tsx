import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, accountTypes, type AccountInput, type Account } from "../../types/accounts";

interface AccountFormProps {
  initialData?: Account;
  onSubmit: (data: AccountInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function AccountForm({ initialData, onSubmit, isSubmitting }: AccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      type: initialData.type,
      balance: initialData.balance,
    } : {
      name: "",
      type: "Bank",
      balance: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Account Name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g., Dad's Wallet"
          className={`w-full rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
            errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Account Type
        </label>
        <div className="relative">
          <select
            {...register("type")}
            className={`w-full appearance-none rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.type ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
            }`}
          >
            {accountTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Starting Balance
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 sm:text-sm">
            Rp
          </span>
          <input
            type="number"
            {...register("balance")}
            placeholder="0"
            className={`w-full rounded-lg border bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              errors.balance ? "border-red-500 focus:border-red-500" : "border-zinc-300 dark:border-zinc-700 focus:border-emerald-500"
            }`}
          />
        </div>
        {errors.balance && <p className="mt-1 text-xs text-red-500">{errors.balance.message}</p>}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Save Account"}
        </button>
      </div>
    </form>
  );
}
