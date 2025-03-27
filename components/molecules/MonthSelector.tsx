import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tw } from "../../tailwind";

import { DefaultComponentProps } from "../../types";
import {
  formatMonthName,
  getPreviousMonth,
  getNextMonth,
  getCurrentMonth,
} from "../../utils/dateUtils";
import { useTheme } from "../../utils/themeContext";

type Props = DefaultComponentProps & {
  currentMonth: string;
  onMonthChange: (month: string) => void;
};

export function MonthSelector(props: Props) {
  const { currentMonth, onMonthChange, style } = props;
  const { isDarkMode } = useTheme();

  const isCurrentMonth = currentMonth === getCurrentMonth();

  const handlePreviousMonth = () => {
    onMonthChange(getPreviousMonth(currentMonth));
  };

  const handleNextMonth = () => {
    onMonthChange(getNextMonth(currentMonth));
  };

  const handleResetToCurrentMonth = () => {
    onMonthChange(getCurrentMonth());
  };

  return (
    <View
      style={[
        tw`mb-6 rounded-2xl p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`,
        {
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.05,
          shadowRadius: 4,
        },
        style,
      ]}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <TouchableOpacity
          style={tw`rounded-xl p-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
          onPress={handlePreviousMonth}
        >
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? "#5eead4" : "#0f766e"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center rounded-xl px-4 py-2`}
          onPress={handleResetToCurrentMonth}
          disabled={isCurrentMonth}
        >
          <Text style={tw`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {formatMonthName(currentMonth)}
          </Text>
          {!isCurrentMonth && (
            <View
              style={tw`ml-2 rounded-full ${isDarkMode ? "bg-teal-900" : "bg-teal-50"} px-2 py-1`}
            >
              <Text
                style={tw`text-xs font-medium ${isDarkMode ? "text-teal-200" : "text-teal-600"}`}
              >
                Reset
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`rounded-xl p-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
          onPress={handleNextMonth}
        >
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? "#5eead4" : "#0f766e"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
