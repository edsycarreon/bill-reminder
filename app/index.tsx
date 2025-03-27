import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

import { useBillStore } from "../stores/billStore";
import { BillCard } from "../components/molecules/BillCard";
import { MonthSelector } from "../components/molecules/MonthSelector";
import { MonthlySummary } from "../components/molecules/MonthlySummary";
import { EmptyState } from "../components/molecules/EmptyState";
import { BillWithStatus } from "../types/bill";
import { requestNotificationPermissions } from "../services/notificationService";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Access store state and actions
  const { currentMonth, setCurrentMonth, getMonthlyBills, getTotalStats, markBillPaid } =
    useBillStore();

  // Get bills and stats for the current month
  const bills = getMonthlyBills(currentMonth);
  const stats = getTotalStats(currentMonth);

  // Request notification permissions when app loads
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Refresh bills when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();
    }, []),
  );

  // Handle month change
  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  // Handle bill selection
  const handleBillPress = (bill: BillWithStatus) => {
    // @ts-ignore - Expo Router typings issue
    router.push(`/bill/${bill.id}`);
  };

  // Handle toggling paid status
  const handleTogglePaid = (billId: string, paid: boolean) => {
    markBillPaid(billId, currentMonth, paid);
  };

  // Handle add new bill
  const handleAddBill = () => {
    // @ts-ignore - Expo Router typings issue
    router.push("/bill/add");
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app with remote data, you would fetch fresh data here
    // For this app, we just simulate a delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-4 pb-20`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Month selector */}
        <MonthSelector currentMonth={currentMonth} onMonthChange={handleMonthChange} />

        {/* Monthly summary */}
        <MonthlySummary stats={stats} />

        {/* Bills list */}
        {bills.length > 0 ? (
          bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              month={currentMonth}
              onPress={handleBillPress}
              onTogglePaid={handleTogglePaid}
            />
          ))
        ) : (
          <EmptyState
            message="You don't have any bills yet. Add your first bill to get started!"
            actionLabel="Add a Bill"
            onAction={handleAddBill}
          />
        )}
      </ScrollView>

      {/* Floating action button */}
      {bills.length > 0 && (
        <TouchableOpacity
          style={tw`absolute right-8 bottom-8 h-14 w-14 items-center justify-center rounded-full bg-teal-600 shadow-lg`}
          onPress={handleAddBill}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
