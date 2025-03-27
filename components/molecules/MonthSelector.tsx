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
    <View style={[tw`mb-4 flex-row items-center justify-between rounded-lg bg-white p-4`, style]}>
      <TouchableOpacity style={tw`p-2`} onPress={handlePreviousMonth}>
        <Ionicons name="chevron-back" size={24} color="#0f766e" />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={handleResetToCurrentMonth}
        disabled={isCurrentMonth}
      >
        <Text style={tw`text-lg font-semibold text-gray-800`}>{formatMonthName(currentMonth)}</Text>
        {!isCurrentMonth && <Text style={tw`ml-2 text-xs text-teal-600`}>(Tap to reset)</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={tw`p-2`} onPress={handleNextMonth}>
        <Ionicons name="chevron-forward" size={24} color="#0f766e" />
      </TouchableOpacity>
    </View>
  );
}
