import { z } from "zod";

export const categoryTypes = ["Income", "Expense"] as const;

export interface Category {
  id: string;
  name: string;
  type: typeof categoryTypes[number];
  created_at: string;
  updated_at: string;
}

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Category name must be less than 100 characters"),
  type: z.enum(["Income", "Expense"], {
    message: "Invalid category type"
  })
});

export type CategoryInput = z.infer<typeof categorySchema>;
