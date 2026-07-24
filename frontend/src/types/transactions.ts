import { z } from "zod";

export const transactionTypes = ["Income", "Expense", "Transfer"] as const;

export const transactionSchema = z.object({
  description: z.string().min(1, "Description is required").max(255, "Description is too long"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(transactionTypes),
  date: z.string().min(1, "Date is required"),
  source_account_id: z.preprocess((val) => (val === "" ? null : val), z.string().uuid("Invalid source account").nullable().optional()),
  destination_account_id: z.preprocess((val) => (val === "" ? null : val), z.string().uuid("Invalid destination account").nullable().optional()),
  category_id: z.preprocess((val) => (val === "" ? null : val), z.string().uuid("Invalid category").nullable().optional()),
  notes: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.type === "Income") {
    if (!data.destination_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Destination account is required for Income",
        path: ["destination_account_id"],
      });
    }
    if (data.source_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source account must be empty for Income",
        path: ["source_account_id"],
      });
    }
    if (!data.category_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required for Income",
        path: ["category_id"],
      });
    }
  } else if (data.type === "Expense") {
    if (!data.source_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source account is required for Expense",
        path: ["source_account_id"],
      });
    }
    if (data.destination_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Destination account must be empty for Expense",
        path: ["destination_account_id"],
      });
    }
    if (!data.category_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required for Expense",
        path: ["category_id"],
      });
    }
  } else if (data.type === "Transfer") {
    if (!data.source_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source account is required for Transfer",
        path: ["source_account_id"],
      });
    }
    if (!data.destination_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Destination account is required for Transfer",
        path: ["destination_account_id"],
      });
    }
    if (data.source_account_id && data.destination_account_id && data.source_account_id === data.destination_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source and destination accounts must be different",
        path: ["destination_account_id"],
      });
    }
    if (data.category_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category must be empty for Transfer",
        path: ["category_id"],
      });
    }
  }
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: typeof transactionTypes[number];
  date: string;
  source_account_id: string | null;
  destination_account_id: string | null;
  category_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields from Supabase relations
  source_accounts?: { name: string } | null;
  destination_accounts?: { name: string } | null;
  categories?: { name: string } | null;
}
