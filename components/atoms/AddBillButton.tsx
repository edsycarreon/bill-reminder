import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { tw } from "../../tailwind";

import { useTheme } from "../../utils/themeContext";

export function AddBillButton() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        tw`absolute right-6 bottom-6 h-14 w-14 items-center justify-center rounded-full`,
        { backgroundColor: "#0f766e" },
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
      onPress={() => router.push("/bill/add")}
    >
      <Ionicons name="add" size={30} color="#ffffff" />
    </TouchableOpacity>
  );
}
