import { useState } from "react";
import { Plus, Trash2, ArrowRight, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Filter, Calendar } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { useAccounts } from "../hooks/useAccounts";
import { useCategories } from "../hooks/useCategories";
import { Modal } from "../components/Modal";
import { TransactionForm } from "../features/transactions/TransactionForm";
import type { TransactionInput } from "../types/transactions";

export function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    accountId: "",
    categoryId: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { transactions, isLoading, createTransaction, deleteTransaction, isCreating } = useTransactions(filters);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (data: TransactionInput) => {
    try {
      await createTransaction(data);
      handleCloseModal();
    } catch (error: any) {
      console.error("Failed to save transaction", error);
      alert(error.message || "An error occurred while saving the transaction.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction? This will revert account balance updates.")) {
      try {
        await deleteTransaction(id);
      } catch (error: any) {
        console.error("Failed to delete transaction", error);
        alert(error.message || "Failed to delete transaction.");
      }
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      accountId: "",
      categoryId: "",
      type: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Transactions</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Review and manage your family transaction history.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Log Transaction
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-medium text-sm">
          <Filter className="h-4 w-4 text-emerald-500" />
          Filter Transactions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Account Filter */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Account</label>
            <select
              value={filters.accountId}
              onChange={(e) => handleFilterChange("accountId", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {(filters.accountId || filters.categoryId || filters.type || filters.startDate || filters.endDate) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Ledger Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No transactions found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            Try adjusting your filters or record a new transaction to populate the ledger.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Date</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Description</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Type</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Category</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Accounts</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-right">Amount</th>
                  <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {transactions.map((t) => {
                  const isIncome = t.type === "Income";
                  const isExpense = t.type === "Expense";
                  const isTransfer = t.type === "Transfer";

                  return (
                    <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="p-4 text-sm text-zinc-950 dark:text-zinc-300 font-medium">
                        {new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="text-zinc-950 dark:text-white font-medium">{t.description}</div>
                        {t.notes && <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{t.notes}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          isIncome ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                          isExpense ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" :
                          "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        }`}>
                          {isIncome && <ArrowUpRight className="h-3 w-3" />}
                          {isExpense && <ArrowDownLeft className="h-3 w-3" />}
                          {isTransfer && <ArrowLeftRight className="h-3 w-3" />}
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {t.categories?.name || <span className="text-zinc-400 dark:text-zinc-600">—</span>}
                      </td>
                      <td className="p-4 text-sm">
                        {isIncome && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            To: {t.destination_accounts?.name}
                          </span>
                        )}
                        {isExpense && (
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            From: {t.source_accounts?.name}
                          </span>
                        )}
                        {isTransfer && (
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1.5">
                            {t.source_accounts?.name} <ArrowRight className="h-3.5 w-3.5 text-zinc-400" /> {t.destination_accounts?.name}
                          </span>
                        )}
                      </td>
                      <td className={`p-4 text-sm font-semibold text-right ${
                        isIncome ? "text-emerald-600 dark:text-emerald-400" :
                        isExpense ? "text-red-600 dark:text-red-400" :
                        "text-zinc-700 dark:text-zinc-300"
                      }`}>
                        {isIncome ? "+" : isExpense ? "-" : ""}Rp {t.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors inline-flex"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Log Transaction"
      >
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
        />
      </Modal>
    </div>
  );
}
