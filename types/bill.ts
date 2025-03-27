export interface Bill {
  id: string; // Unique identifier
  name: string; // Name of the bill
  description?: string; // Optional description
  amount: number; // Amount due
  dueDay: number; // Day of month when bill is due (1-31)
  reminderDays: number; // Days before due date to send reminder
  category?: string; // Optional category for grouping
  color?: string; // Optional color for visual identification
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface MonthlyBillStatus {
  month: string; // Format: "YYYY-MM"
  bills: {
    [billId: string]: {
      paid: boolean; // Whether bill is paid for this month
      paidDate: string | null; // ISO date string when paid
      amount?: number; // Optional override of bill amount for this month
    };
  };
}

export interface BillWithStatus extends Bill {
  paid: boolean;
  paidDate: string | null;
  actualAmount?: number;
}

export interface MonthlyStats {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paidPercentage: number;
}
