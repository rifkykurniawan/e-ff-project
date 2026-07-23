import { supabase } from "./supabaseClient";
import type { Account, AccountInput } from "../types/accounts";

export const accountsService = {
  async getAccounts(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAccount(input: AccountInput): Promise<Account> {
    const { data, error } = await supabase
      .from('accounts')
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccount(id: string, input: AccountInput): Promise<Account> {
    const { data, error } = await supabase
      .from('accounts')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
