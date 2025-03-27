import React from "react";
import { View, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { tw } from "../../tailwind";

import { BillDetails } from "../../components/molecules/BillDetails";
import { useBillStore } from "../../stores/billStore";

export default function BillDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Access store state and actions
  const {
    bills,
    currentMonth,
    getMonthlyBills,
    getBillHistory,
    markBillPaid,
    updateBill,
    deleteBill,
  } = useBillStore();

  // Get the bill data with status
  const monthlyBills = getMonthlyBills(currentMonth);
  const bill = monthlyBills.find((b) => b.id === id);

  // Get bill payment history for the last 6 months
  const history = getBillHistory(id as string, 6);

  // Handle bill edit
  const handleEdit = () => {
    // @ts-ignore - Expo Router typings issue
    router.push(`/bill/edit/${id}`);
  };

  // Handle bill delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      "Delete Bill",
      "Are you sure you want to delete this bill? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteBill(id as string);
            router.back();
          },
        },
      ],
    );
  };

  // Handle toggling paid status
  const handleTogglePaid = (paid: boolean) => {
    markBillPaid(id as string, currentMonth, paid);
  };

  // If bill not found, return to home
  if (!bill) {
    router.back();
    return null;
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />
      <BillDetails
        bill={bill}
        history={history}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePaid={handleTogglePaid}
      />
    </View>
  );
}
