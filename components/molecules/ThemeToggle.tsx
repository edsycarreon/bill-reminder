import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tw } from "../../tailwind";

import { useTheme } from "../../utils/themeContext";
import { DefaultComponentProps } from "../../types";

type Props = DefaultComponentProps;

export function ThemeToggle(props: Props) {
  const { style } = props;
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[tw`rounded-full p-2`, isDarkMode ? tw`bg-gray-800` : tw`bg-gray-100`, style]}
      onPress={toggleTheme}
    >
      <Ionicons
        name={isDarkMode ? "moon" : "sunny"}
        size={24}
        color={isDarkMode ? "#e5e7eb" : "#374151"}
      />
    </TouchableOpacity>
  );
}
