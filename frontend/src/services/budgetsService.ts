import { supabase } from "./supabaseClient";
import type { Budget, BudgetInput } from "../types/budgets";

export const budgetsService = {
  async getBudgets(year: number, month: number): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*, categories(name, type)')
      .eq('year', year)
      .eq('month', month);

    if (error) throw error;
    return data || [];
  },

  async createBudget(input: BudgetInput): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .insert([input])
      .select('*, categories(name, type)')
      .single();

    if (error) throw error;
    return data;
  },

  async updateBudget(id: string, input: Partial<BudgetInput>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .update(input)
      .eq('id', id)
      .select('*, categories(name, type)')
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
