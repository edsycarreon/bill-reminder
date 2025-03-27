import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { format } from "date-fns";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { BillWithStatus } from "../../types/bill";
import { isDueSoon, isOverdue } from "../../utils/dateUtils";
import { DefaultComponentProps } from "../../types";

type Props = DefaultComponentProps & {
  bill: BillWithStatus;
  month: string;
  onPress: (bill: BillWithStatus) => void;
  onTogglePaid: (billId: string, paid: boolean) => void;
};

export function BillCard(props: Props) {
  const { bill, month, onPress, onTogglePaid, style } = props;

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

  return (
    <TouchableOpacity
      style={[
        tw`mb-3 flex-row items-center rounded-lg bg-white p-4 shadow-sm`,
        getBillStyles(),
        style,
      ]}
      onPress={() => onPress(bill)}
    >
      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-semibold`}>{bill.name}</Text>
        <Text style={tw`text-gray-600`}>{getDueDateText()}</Text>
        {bill.description ? (
          <Text style={tw`mt-1 text-gray-500`} numberOfLines={1}>
            {bill.description}
          </Text>
        ) : null}
      </View>

      <View style={tw`flex-row items-center`}>
        <Text style={tw`mr-3 text-lg font-bold`}>
          ${(bill.actualAmount || bill.amount).toFixed(2)}
        </Text>

        <TouchableOpacity
          style={[
            tw`h-7 w-7 items-center justify-center rounded-full border-2`,
            bill.paid ? tw`border-green-500 bg-green-500` : tw`border-gray-300`,
          ]}
          onPress={handleTogglePaid}
        >
          {bill.paid && <Ionicons name="checkmark" size={18} color="white" />}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
