import { z } from "zod";

export const accountTypes = ["Cash", "Bank", "E-Wallet", "Savings", "Investment"] as const;

export interface Account {
  id: string;
  name: string;
  type: typeof accountTypes[number];
  balance: number;
  created_at: string;
  updated_at: string;
}

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100, "Account name must be less than 100 characters"),
  type: z.enum(["Cash", "Bank", "E-Wallet", "Savings", "Investment"], {
    message: "Invalid account type"
  }),
  balance: z.coerce.number(),
});

export type AccountInput = z.infer<typeof accountSchema>;
