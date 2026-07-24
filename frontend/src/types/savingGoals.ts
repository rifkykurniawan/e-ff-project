import { z } from "zod";

export interface SavingGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const savingGoalSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100, "Goal name must be less than 100 characters"),
  target_amount: z.coerce.number().positive("Target amount must be greater than 0"),
  current_amount: z.coerce.number().nonnegative("Current amount must be 0 or greater"),
  target_date: z.preprocess((val) => (val === "" ? null : val), z.string().nullable().optional()),
  notes: z.string().nullable().optional(),
}).refine((data) => data.current_amount <= data.target_amount, {
  message: "Current saved amount cannot exceed the target amount",
  path: ["current_amount"],
});

export type SavingGoalInput = z.infer<typeof savingGoalSchema>;
