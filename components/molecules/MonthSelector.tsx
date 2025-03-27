import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

import { DefaultComponentProps } from "../../types";
import {
  formatMonthName,
  getPreviousMonth,
  getNextMonth,
  getCurrentMonth,
} from "../../utils/dateUtils";

type Props = DefaultComponentProps & {
  currentMonth: string;
  onMonthChange: (month: string) => void;
};

export function MonthSelector(props: Props) {
  const { currentMonth, onMonthChange, style } = props;

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
        tw`mb-6 rounded-2xl bg-white p-4`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        style,
      ]}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <TouchableOpacity style={tw`rounded-xl bg-gray-50 p-3`} onPress={handlePreviousMonth}>
          <Ionicons name="chevron-back" size={24} color="#0f766e" />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center rounded-xl px-4 py-2`}
          onPress={handleResetToCurrentMonth}
          disabled={isCurrentMonth}
        >
          <Text style={tw`text-xl font-bold text-gray-900`}>{formatMonthName(currentMonth)}</Text>
          {!isCurrentMonth && (
            <View style={tw`ml-2 rounded-full bg-teal-50 px-2 py-1`}>
              <Text style={tw`text-xs font-medium text-teal-600`}>Reset</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={tw`rounded-xl bg-gray-50 p-3`} onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#0f766e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
