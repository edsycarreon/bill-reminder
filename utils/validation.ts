import { z } from "zod";

export const billSchema = z.object({
  name: z.string().min(1, "Bill name is required"),
  description: z.string().optional().default(""),
  amount: z.preprocess(
    // Handle string inputs and convert to number
    (val) => (val === "" || val === null ? 0 : Number(val)),
    z.number().nonnegative("Amount must be a positive number").default(0),
  ),
  dueDay: z.preprocess(
    // Handle string inputs and convert to number
    (val) => (val === "" || val === null ? 1 : Number(val)),
    z.number().min(1, "Day must be at least 1").max(31, "Day cannot exceed 31").default(1),
  ),
  reminderDays: z.preprocess(
    // Handle string inputs and convert to number
    (val) => (val === "" || val === null ? 0 : Number(val)),
    z
      .number()
      .min(0, "Reminder days cannot be negative")
      .max(30, "Reminder days cannot exceed 30")
      .default(3),
  ),
  category: z.string().optional().default(""),
  color: z.string().optional().default("#0f766e"),
});

export type BillFormValues = z.infer<typeof billSchema>;

// Validation for monthly bill status overrides
export const monthlyBillStatusSchema = z.object({
  paid: z.boolean().default(false),
  paidDate: z.string().nullable().default(null),
  amount: z.preprocess(
    (val) => (val === "" || val === null ? undefined : Number(val)),
    z.number().positive("Amount must be greater than 0").optional(),
  ),
});

export type MonthlyBillStatusFormValues = z.infer<typeof monthlyBillStatusSchema>;
