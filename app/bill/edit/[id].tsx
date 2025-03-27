import React from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";

import { BillForm } from "../../../components/molecules/BillForm";
import { useBillStore } from "../../../stores/billStore";
import { BillFormValues } from "../../../utils/validation";

export default function EditBillScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { bills, updateBill } = useBillStore();
  const bill = bills[id as string];

  const handleSubmit = async (data: BillFormValues) => {
    if (bill) {
      await updateBill(bill.id, data);
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  // If bill not found, return to home
  if (!bill) {
    router.back();
    return null;
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />
      <BillForm initialValues={bill} onSubmit={handleSubmit} onCancel={handleCancel} />
    </View>
  );
}
