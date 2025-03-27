import React from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";

import { BillForm } from "../../components/molecules/BillForm";
import { useBillStore } from "../../stores/billStore";
import { BillFormValues } from "../../utils/validation";

export default function AddBillScreen() {
  const router = useRouter();
  const { addBill } = useBillStore();

  const handleSubmit = async (data: BillFormValues) => {
    try {
      console.log("Submitting bill data:", data);
      await addBill(data);
      console.log("Bill added successfully");

      // Give a visual confirmation to the user
      Alert.alert("Success", "Bill added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error adding bill:", error);
      Alert.alert("Error", "Failed to add bill. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />
      <BillForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </View>
  );
}
