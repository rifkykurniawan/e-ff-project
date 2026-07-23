import { supabase } from "./supabaseClient";
import type { Category, CategoryInput } from "../types/categories";

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, input: CategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
