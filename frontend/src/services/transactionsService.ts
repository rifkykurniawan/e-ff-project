import { supabase } from "./supabaseClient";
import type { Transaction, TransactionInput } from "../types/transactions";

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export const transactionsService = {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    let query = supabase
      .from("transactions")
      .select(`
        *,
        source_accounts:accounts!transactions_source_account_id_fkey(name),
        destination_accounts:accounts!transactions_destination_account_id_fkey(name),
        categories:categories(name)
      `)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (filters) {
      if (filters.accountId) {
        query = query.or(`source_account_id.eq.${filters.accountId},destination_account_id.eq.${filters.accountId}`);
      }
      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      if (filters.startDate) {
        query = query.gte("date", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("date", filters.endDate);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createTransaction(input: TransactionInput): Promise<Transaction> {
    const { data, error } = await supabase
      .from("transactions")
      .insert([input])
      .select(`
        *,
        source_accounts:accounts!transactions_source_account_id_fkey(name),
        destination_accounts:accounts!transactions_destination_account_id_fkey(name),
        categories:categories(name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
