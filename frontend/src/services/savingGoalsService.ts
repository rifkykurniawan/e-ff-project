import { supabase } from "./supabaseClient";
import type { SavingGoal, SavingGoalInput } from "../types/savingGoals";

export const savingGoalsService = {
  async getSavingGoals(): Promise<SavingGoal[]> {
    const { data, error } = await supabase
      .from('saving_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSavingGoal(input: SavingGoalInput): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSavingGoal(id: string, input: Partial<SavingGoalInput>): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSavingGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('saving_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
