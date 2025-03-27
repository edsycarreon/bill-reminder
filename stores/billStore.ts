import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parse } from "date-fns";
import { Bill, MonthlyBillStatus, BillWithStatus, MonthlyStats } from "../types/bill";
import { scheduleNotification, cancelNotifications } from "../services/notificationService";

// Replace the current ID generator with this improved version
const generateId = (): string => {
  // Get current timestamp in milliseconds (high precision)
  const timestamp = Date.now();

  // Create multiple sources of randomness
  const randomA = Math.floor(Math.random() * 1000000).toString(36);
  const randomB = Math.floor(Math.random() * 1000000).toString(36);

  // Add some deterministic but unique values
  const dateStr = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 6);

  // Combine everything with separators to ensure uniqueness
  return `bill_${timestamp.toString(36)}_${dateStr}_${randomA}${randomB}`;
};

// Define initial state to ensure consistent structure
const initialState = {
  bills: {},
  monthlyStatus: {},
  currentMonth: format(new Date(), "yyyy-MM"),
  isLoading: false,
  error: null,
};

// Store types
interface BillStore {
  // State
  bills: Record<string, Bill>;
  monthlyStatus: Record<string, MonthlyBillStatus>;
  currentMonth: string; // Format: "YYYY-MM"
  isLoading: boolean;
  error: string | null;

  // Hydration state
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Actions
  fetchBills: () => Promise<void>;
  addBill: (bill: Omit<Bill, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateBill: (id: string, updates: Partial<Bill>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  markBillPaid: (billId: string, month: string, paid: boolean) => Promise<void>;
  setCurrentMonth: (month: string) => void;
  getMonthlyBills: (month: string) => Array<BillWithStatus>;
  getBillHistory: (
    billId: string,
    months: number,
  ) => Array<{ month: string; paid: boolean; paidDate: string | null }>;
  getTotalStats: (month: string) => MonthlyStats;
}

// Type for the persisted state (subset of BillStore without functions)
type PersistedState = {
  bills: Record<string, Bill>;
  monthlyStatus: Record<string, MonthlyBillStatus>;
  currentMonth: string;
  isLoading: boolean;
  error: string | null;
};

// Flag to prevent multiple hydration callbacks
let isHydrationComplete = false;

// Create a properly typed async storage for Zustand with logging
const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      console.log(`Getting data from AsyncStorage: ${name}`);
      const value = await AsyncStorage.getItem(name);
      console.log(`Data retrieved from AsyncStorage: ${name}`, value ? "Found" : "Not found");
      return value;
    } catch (error) {
      console.error(`Error getting data from AsyncStorage: ${name}`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      console.log(`Storing data in AsyncStorage: ${name}`);
      await AsyncStorage.setItem(name, value);
      console.log(`Data successfully stored in AsyncStorage: ${name}`);
    } catch (error) {
      console.error(`Error storing data in AsyncStorage: ${name}`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      console.log(`Removing data from AsyncStorage: ${name}`);
      await AsyncStorage.removeItem(name);
      console.log(`Data removed from AsyncStorage: ${name}`);
    } catch (error) {
      console.error(`Error removing data from AsyncStorage: ${name}`, error);
    }
  },
};

export const useBillStore = create<BillStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Add hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => {
        // Prevent redundant updates to hydration state
        if (get()._hasHydrated !== state) {
          console.log(`Setting hydration state to: ${state}`);
          set({
            _hasHydrated: state,
          });
        }
      },

      fetchBills: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this might fetch from a remote API
          // With AsyncStorage, data is loaded automatically via persist middleware
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      addBill: async (billData) => {
        console.log("Adding bill to store:", billData);
        try {
          const newBill: Bill = {
            id: generateId(),
            ...billData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => {
            console.log("Updating state with new bill:", newBill.id);
            return {
              bills: {
                ...state.bills,
                [newBill.id]: newBill,
              },
            };
          });

          // Schedule notification for the bill
          const currentMonth = get().currentMonth;
          await scheduleNotification(newBill, currentMonth);
          console.log("Bill added successfully:", newBill.id);
        } catch (error) {
          console.error("Error adding bill:", error);
          throw error;
        }
      },

      updateBill: async (id, updates) => {
        try {
          set((state) => {
            const bill = state.bills[id];
            if (!bill) return state;

            const updatedBill = {
              ...bill,
              ...updates,
              updatedAt: new Date().toISOString(),
            };

            return {
              bills: {
                ...state.bills,
                [id]: updatedBill,
              },
            };
          });

          // Reschedule notification with updated data
          const updatedBill = get().bills[id];
          if (updatedBill) {
            await cancelNotifications(id);
            await scheduleNotification(updatedBill, get().currentMonth);
          }
        } catch (error) {
          console.error("Error updating bill:", error);
          throw error;
        }
      },

      deleteBill: async (id) => {
        set((state) => {
          const { [id]: _, ...remainingBills } = state.bills;

          // Remove bill from monthly statuses
          const updatedMonthlyStatus = { ...state.monthlyStatus };

          Object.keys(updatedMonthlyStatus).forEach((month) => {
            if (updatedMonthlyStatus[month].bills[id]) {
              const { [id]: __, ...remainingMonthBills } = updatedMonthlyStatus[month].bills;
              updatedMonthlyStatus[month] = {
                ...updatedMonthlyStatus[month],
                bills: remainingMonthBills,
              };
            }
          });

          return {
            bills: remainingBills,
            monthlyStatus: updatedMonthlyStatus,
          };
        });

        // Cancel notifications for deleted bill
        await cancelNotifications(id);
      },

      markBillPaid: async (billId, month, paid) => {
        set((state) => {
          const bill = state.bills[billId];
          if (!bill) return state;

          const currentMonthStatus = state.monthlyStatus[month] || {
            month,
            bills: {},
          };

          const updatedMonthlyStatus = {
            ...state.monthlyStatus,
            [month]: {
              ...currentMonthStatus,
              bills: {
                ...currentMonthStatus.bills,
                [billId]: {
                  ...currentMonthStatus.bills[billId],
                  paid,
                  paidDate: paid ? new Date().toISOString() : null,
                },
              },
            },
          };

          return {
            monthlyStatus: updatedMonthlyStatus,
          };
        });

        // If bill is marked as paid, cancel any pending notifications
        if (paid) {
          await cancelNotifications(billId);
        } else {
          // If bill is marked as unpaid, reschedule notifications if it's for current/future month
          const currentDate = new Date();
          const billMonth = parse(month, "yyyy-MM", new Date());

          if (billMonth >= currentDate) {
            const bill = get().bills[billId];
            if (bill) {
              await scheduleNotification(bill, month);
            }
          }
        }
      },

      setCurrentMonth: (month) => {
        set({ currentMonth: month });
      },

      getMonthlyBills: (month) => {
        const { bills, monthlyStatus } = get();
        const monthData = monthlyStatus[month] || { month, bills: {} };

        return Object.values(bills)
          .map((bill) => {
            const status = monthData.bills[bill.id] || { paid: false, paidDate: null };
            return {
              ...bill,
              paid: status.paid,
              paidDate: status.paidDate,
              actualAmount: status.amount || bill.amount,
            };
          })
          .sort((a, b) => a.dueDay - b.dueDay);
      },

      getBillHistory: (billId, months) => {
        const { monthlyStatus } = get();
        const history: Array<{ month: string; paid: boolean; paidDate: string | null }> = [];

        // Get all months in descending order
        const allMonths = Object.keys(monthlyStatus).sort().reverse();

        // Take only the requested number of months
        const recentMonths = allMonths.slice(0, months);

        for (const month of recentMonths) {
          const monthData = monthlyStatus[month];
          if (monthData && monthData.bills[billId]) {
            const { paid, paidDate } = monthData.bills[billId];
            history.push({ month, paid, paidDate });
          } else {
            history.push({ month, paid: false, paidDate: null });
          }
        }

        return history;
      },

      getTotalStats: (month) => {
        const bills = get().getMonthlyBills(month);

        const totalAmount = bills.reduce(
          (sum, bill) => sum + (bill.actualAmount || bill.amount),
          0,
        );
        const paidAmount = bills
          .filter((bill) => bill.paid)
          .reduce((sum, bill) => sum + (bill.actualAmount || bill.amount), 0);
        const unpaidAmount = totalAmount - paidAmount;
        const paidPercentage = bills.length > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

        return {
          totalAmount,
          paidAmount,
          unpaidAmount,
          paidPercentage,
        };
      },
    }),
    {
      name: "bill-storage",
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
      partialize: (state) => {
        // Remove functions and other non-serializable data
        const {
          _hasHydrated,
          setHasHydrated,
          fetchBills,
          addBill,
          updateBill,
          deleteBill,
          markBillPaid,
          setCurrentMonth,
          getMonthlyBills,
          getBillHistory,
          getTotalStats,
          ...rest
        } = state;
        return rest;
      },
      onRehydrateStorage: (state) => {
        // Before hydration
        console.log("Hydration starting...");
        // Reset hydration flag
        isHydrationComplete = false;

        return (restoredState, error) => {
          // Prevent multiple callbacks from running
          if (isHydrationComplete) {
            console.log("Ignoring duplicate hydration callback");
            return;
          }

          // Mark hydration as complete
          isHydrationComplete = true;

          // After hydration
          if (error) {
            console.error("Error rehydrating state:", error);
          } else if (restoredState) {
            console.log("State rehydrated successfully:", Object.keys(restoredState));
            restoredState.setHasHydrated(true);
          } else {
            console.log("No state to rehydrate, using initial state");
            if (state) {
              state.setHasHydrated(true);
            }
          }
        };
      },
      // Better merge strategy for the store
      merge: (persistedState, currentState) => {
        console.log(
          "Merging states - persisted:",
          persistedState ? Object.keys(persistedState).length : "none",
          "current:",
          Object.keys(currentState).length,
        );

        // First check if persisted state exists
        if (!persistedState) {
          return {
            ...currentState,
            _hasHydrated: currentState._hasHydrated,
          };
        }

        // Now we know persistedState exists, so merge it
        return {
          ...currentState,
          ...(persistedState as PersistedState),
          // Always preserve internal state
          _hasHydrated: currentState._hasHydrated,
        };
      },
    },
  ),
);
