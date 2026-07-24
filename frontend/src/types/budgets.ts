import { z } from "zod";

export interface Budget {
  id: string;
  category_id: string;
  year: number;
  month: number;
  planned_amount: number;
  created_at: string;
  updated_at: string;
  
  // Joined relation fields
  categories?: { name: string; type: string } | null;
}

export const budgetSchema = z.object({
  category_id: z.string().uuid("Please select a valid category"),
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  planned_amount: z.coerce.number().nonnegative("Planned amount must be 0 or greater"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
