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
}).refine((data) => {
  if (data.type === "Income") {
    return !!data.destination_account_id && !data.source_account_id && !!data.category_id;
  }
  if (data.type === "Expense") {
    return !!data.source_account_id && !data.destination_account_id && !!data.category_id;
  }
  if (data.type === "Transfer") {
    return (
      !!data.source_account_id &&
      !!data.destination_account_id &&
      data.source_account_id !== data.destination_account_id &&
      !data.category_id
    );
  }
  return true;
}, {
  message: "Invalid transaction fields for selected type.",
  path: ["type"]
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
