import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tw } from "../../tailwind";

import { BillWithStatus } from "../../types/bill";
import { isDueSoon, isOverdue } from "../../utils/dateUtils";
import { DefaultComponentProps } from "../../types";
import { useTheme } from "../../utils/themeContext";

type Props = DefaultComponentProps & {
  bill: BillWithStatus;
  month: string;
  onPress: (bill: BillWithStatus) => void;
  onTogglePaid: (billId: string, paid: boolean) => void;
};

export function BillCard(props: Props) {
  const { bill, month, onPress, onTogglePaid, style } = props;
  const { isDarkMode } = useTheme();

  // Calculate bill status indicators
  const dueSoon = isDueSoon(bill.dueDay, month);
  const overdue = isOverdue(bill.dueDay, month);

  // Formatting due date display (e.g., "Due on 15th")
  const getDueDateText = () => {
    const suffix = getDaySuffix(bill.dueDay);
    return `Due on ${bill.dueDay}${suffix}`;
  };

  // Get the appropriate suffix for day numbers (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Handle toggle paid status
  const handleTogglePaid = () => {
    onTogglePaid(bill.id, !bill.paid);
  };

  // Style variations based on bill status
  const getBillStyles = () => {
    if (bill.paid) {
      return tw`opacity-60`;
    }
    if (overdue) {
      return tw`border-l-4 border-red-500`;
    }
    if (dueSoon) {
      return tw`border-l-4 border-yellow-500`;
    }
    return null;
  };

  // Get status color for the category tag
  const getStatusColor = () => {
    if (bill.paid)
      return isDarkMode ? tw`bg-green-900 text-green-100` : tw`bg-green-100 text-green-800`;
    if (overdue) return isDarkMode ? tw`bg-red-900 text-red-100` : tw`bg-red-100 text-red-800`;
    if (dueSoon)
      return isDarkMode ? tw`bg-yellow-900 text-yellow-100` : tw`bg-yellow-100 text-yellow-800`;
    return isDarkMode ? tw`bg-gray-800 text-gray-100` : tw`bg-gray-100 text-gray-800`;
  };

  return (
    <TouchableOpacity
      style={[
        tw`mb-4 rounded-xl p-4`,
        isDarkMode ? tw`bg-gray-800` : tw`bg-white`,
        {
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        getBillStyles(),
        style,
      ]}
      onPress={() => onPress(bill)}
    >
      <View style={tw`flex-row items-start justify-between`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {bill.name}
          </Text>
          {bill.category && (
            <View style={tw`mt-1 flex-row items-center`}>
              <View style={getStatusColor()}>
                <Text style={tw`rounded-full px-2 py-1 text-xs font-medium`}>{bill.category}</Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            tw`h-8 w-8 items-center justify-center rounded-full border-2`,
            bill.paid
              ? tw`border-green-500 bg-green-500`
              : isDarkMode
                ? tw`border-gray-700`
                : tw`border-gray-300`,
          ]}
          onPress={handleTogglePaid}
        >
          {bill.paid && <Ionicons name="checkmark" size={20} color="white" />}
        </TouchableOpacity>
      </View>

      <View style={tw`mt-3 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="calendar-outline" size={16} color={isDarkMode ? "#9ca3af" : "#6B7280"} />
          <Text style={tw`ml-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {getDueDateText()}
          </Text>
        </View>

        <Text style={tw`text-lg font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          ${(bill.actualAmount || bill.amount).toFixed(2)}
        </Text>
      </View>

      {bill.description ? (
        <Text
          style={tw`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          numberOfLines={1}
        >
          {bill.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
