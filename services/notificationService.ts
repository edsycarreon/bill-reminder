import * as Notifications from "expo-notifications";
import { format, parse, subDays } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bill } from "../types/bill";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Storage key for notification identifiers
const NOTIFICATION_KEY = "bill_notifications";

/**
 * Request notification permissions
 * @returns True if permissions are granted
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

/**
 * Store notification identifier for a bill
 * @param billId The bill ID
 * @param identifier The notification identifier
 */
export const storeNotificationIdentifier = async (
  billId: string,
  identifier: string,
): Promise<void> => {
  const identifiersJson = (await AsyncStorage.getItem(NOTIFICATION_KEY)) || "{}";
  const identifiers = JSON.parse(identifiersJson);

  identifiers[billId] = [...(identifiers[billId] || []), identifier];
  await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(identifiers));
};

/**
 * Get notification identifiers for a bill
 * @param billId The bill ID
 * @returns Array of notification identifiers
 */
export const getNotificationIdentifiers = async (billId: string): Promise<string[]> => {
  const identifiersJson = (await AsyncStorage.getItem(NOTIFICATION_KEY)) || "{}";
  const identifiers = JSON.parse(identifiersJson);
  return identifiers[billId] || [];
};

/**
 * Clear notification identifiers for a bill
 * @param billId The bill ID
 */
export const clearNotificationIdentifiers = async (billId: string): Promise<void> => {
  const identifiersJson = (await AsyncStorage.getItem(NOTIFICATION_KEY)) || "{}";
  const identifiers = JSON.parse(identifiersJson);

  delete identifiers[billId];
  await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(identifiers));
};

/**
 * Schedule notification for a bill
 * @param bill The bill to schedule notification for
 * @param currentMonth The current month in YYYY-MM format
 */
export const scheduleNotification = async (bill: Bill, currentMonth: string): Promise<void> => {
  // Check if permissions are granted
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.log("Notification permissions not granted");
    return;
  }

  // Calculate the due date for the current month
  const dueDate = parse(`${currentMonth}-${bill.dueDay}`, "yyyy-MM-dd", new Date());

  // Calculate the reminder date based on reminderDays
  const reminderDate = subDays(dueDate, bill.reminderDays);

  // Only schedule if the reminder date is in the future
  if (reminderDate > new Date()) {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${bill.name} due soon`,
          body: `${bill.name} for $${bill.amount.toFixed(2)} is due on ${format(dueDate, "MMMM d")}`,
          data: { billId: bill.id },
        },
        trigger: {
          seconds: Math.floor((reminderDate.getTime() - Date.now()) / 1000),
          channelId: "bill-reminders",
        },
      });

      // Store the notification identifier for later use
      await storeNotificationIdentifier(bill.id, identifier);
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  }
};

/**
 * Cancel all notifications for a bill
 * @param billId The bill ID
 */
export const cancelNotifications = async (billId: string): Promise<void> => {
  const identifiers = await getNotificationIdentifiers(billId);

  for (const identifier of identifiers) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error(`Error cancelling notification ${identifier}:`, error);
    }
  }

  await clearNotificationIdentifiers(billId);
};

/**
 * Schedule notifications for all bills
 * @param bills Record of bills
 * @param currentMonth The current month in YYYY-MM format
 */
export const scheduleAllNotifications = async (
  bills: Record<string, Bill>,
  currentMonth: string,
): Promise<void> => {
  for (const bill of Object.values(bills)) {
    await scheduleNotification(bill, currentMonth);
  }
};
