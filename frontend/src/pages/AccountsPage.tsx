import { useState } from "react";
import { Plus, Edit2, Trash2, Wallet } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import { Modal } from "../components/Modal";
import { AccountForm } from "../features/accounts/AccountForm";
import type { Account, AccountInput } from "../types/accounts";

export function AccountsPage() {
  const { accounts, isLoading, createAccount, updateAccount, deleteAccount } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();

  const handleOpenModal = (account?: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(undefined);
  };

  const handleSubmit = async (data: AccountInput) => {
    try {
      if (editingAccount) {
        await updateAccount({ id: editingAccount.id, input: data });
      } else {
        await createAccount(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save account", error);
      alert("An error occurred while saving the account.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(id);
      } catch (error) {
        console.error("Failed to delete account", error);
        alert("Failed to delete account. It might be used in transactions.");
      }
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-zinc-500">Loading accounts...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Accounts</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your family's bank accounts, e-wallets, and cash.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No accounts found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            You haven't added any accounts yet. Create one to start tracking your balances and transactions.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            + Add your first account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleOpenModal(account)} className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(account.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{account.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {account.type}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current Balance</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {formatRupiah(account.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAccount ? "Edit Account" : "Add New Account"}
      >
        <AccountForm 
          initialData={editingAccount} 
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
