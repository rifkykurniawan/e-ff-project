import { supabase } from "./supabaseClient";
import type { SavingGoal, SavingGoalInput } from "../types/savingGoals";

const mapSavingGoalData = (goal: any): SavingGoal => {
  if (!goal) return goal;
  return {
    ...goal,
    current_amount: goal.accounts ? Number(goal.accounts.balance) : Number(goal.current_amount)
  };
};

export const savingGoalsService = {
  async getSavingGoals(): Promise<SavingGoal[]> {
    const { data, error } = await supabase
      .from('saving_goals')
      .select('*, accounts:accounts(name, balance)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapSavingGoalData);
  },

  async createSavingGoal(input: SavingGoalInput): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .insert([input])
      .select('*, accounts:accounts(name, balance)')
      .single();

    if (error) throw error;
    return mapSavingGoalData(data);
  },

  async updateSavingGoal(id: string, input: Partial<SavingGoalInput>): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .update(input)
      .eq('id', id)
      .select('*, accounts:accounts(name, balance)')
      .single();

    if (error) throw error;
    return mapSavingGoalData(data);
  },

  async deleteSavingGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('saving_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
