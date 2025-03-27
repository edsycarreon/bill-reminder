import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { format } from "date-fns";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { DefaultComponentProps } from "../../types";
import { BillWithStatus } from "../../types/bill";
import { formatMonthName } from "../../utils/dateUtils";

type Props = DefaultComponentProps & {
  bill: BillWithStatus;
  history: Array<{ month: string; paid: boolean; paidDate: string | null }>;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePaid: (paid: boolean) => void;
};

export function BillDetails(props: Props) {
  const { bill, history, onEdit, onDelete, onTogglePaid, style } = props;

  // Format date display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Calculate due date text
  const getDueDateText = () => {
    const suffix = getDaySuffix(bill.dueDay);
    return `${bill.dueDay}${suffix} of each month`;
  };

  // Get suffix for day numbers
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

  return (
    <ScrollView style={[tw`flex-1`, style]} contentContainerStyle={tw`p-4`}>
      {/* Header with bill name and actions */}
      <View style={tw`mb-6 flex-row items-center justify-between`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-2xl font-bold`}>{bill.name}</Text>
          {bill.category && <Text style={tw`mt-1 text-gray-600`}>Category: {bill.category}</Text>}
        </View>

        <View style={tw`flex-row`}>
          <TouchableOpacity style={tw`mr-2 p-2`} onPress={onEdit}>
            <Ionicons name="pencil" size={22} color="#0f766e" />
          </TouchableOpacity>

          <TouchableOpacity style={tw`p-2`} onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="#be123c" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current status section */}
      <View style={tw`mb-6 rounded-lg bg-white p-4`}>
        <Text style={tw`mb-4 text-lg font-semibold`}>Current Status</Text>

        <View style={tw`mb-2 flex-row items-center justify-between`}>
          <Text style={tw`text-gray-600`}>Amount:</Text>
          <Text style={tw`text-lg font-bold`}>
            ${(bill.actualAmount || bill.amount).toFixed(2)}
          </Text>
        </View>

        <View style={tw`mb-2 flex-row items-center justify-between`}>
          <Text style={tw`text-gray-600`}>Due Date:</Text>
          <Text style={tw`font-medium`}>{getDueDateText()}</Text>
        </View>

        <View style={tw`mb-4 flex-row items-center justify-between`}>
          <Text style={tw`text-gray-600`}>Reminder:</Text>
          <Text style={tw`font-medium`}>
            {bill.reminderDays} day{bill.reminderDays !== 1 ? "s" : ""} before due date
          </Text>
        </View>

        <View style={tw`my-3 h-px bg-gray-200`} />

        <View style={tw`mb-1 flex-row items-center justify-between`}>
          <Text style={tw`text-gray-600`}>Status:</Text>
          <View style={tw`flex-row items-center`}>
            <Text style={[tw`mr-2 font-bold`, bill.paid ? tw`text-green-600` : tw`text-red-600`]}>
              {bill.paid ? "Paid" : "Unpaid"}
            </Text>

            <TouchableOpacity
              style={[
                tw`h-6 w-6 items-center justify-center rounded-full border-2`,
                bill.paid ? tw`border-green-500 bg-green-500` : tw`border-gray-300`,
              ]}
              onPress={() => onTogglePaid(!bill.paid)}
            >
              {bill.paid && <Ionicons name="checkmark" size={14} color="white" />}
            </TouchableOpacity>
          </View>
        </View>

        {bill.paid && bill.paidDate && (
          <Text style={tw`text-right text-sm text-gray-500`}>
            Paid on {formatDate(bill.paidDate)}
          </Text>
        )}
      </View>

      {/* Description section (if available) */}
      {bill.description ? (
        <View style={tw`mb-6 rounded-lg bg-white p-4`}>
          <Text style={tw`mb-2 text-lg font-semibold`}>Description</Text>
          <Text style={tw`text-gray-700`}>{bill.description}</Text>
        </View>
      ) : null}

      {/* Payment history section */}
      <View style={tw`mb-4 rounded-lg bg-white p-4`}>
        <Text style={tw`mb-4 text-lg font-semibold`}>Payment History</Text>

        {history.length > 0 ? (
          history.map((item, index) => (
            <View
              key={item.month}
              style={[
                tw`flex-row items-center justify-between py-3`,
                index < history.length - 1 && tw`border-b border-gray-100`,
              ]}
            >
              <Text style={tw`font-medium`}>{formatMonthName(item.month)}</Text>
              <View style={tw`flex-row items-center`}>
                {item.paid ? (
                  <>
                    <Text style={tw`mr-2 font-medium text-green-600`}>Paid</Text>
                    <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
                  </>
                ) : (
                  <>
                    <Text style={tw`mr-2 font-medium text-gray-400`}>Not paid</Text>
                    <Ionicons name="close-circle" size={18} color="#d1d5db" />
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={tw`py-4 text-center text-gray-500`}>No payment history available</Text>
        )}
      </View>

      {/* Creation and update info */}
      <View style={tw`mt-2`}>
        <Text style={tw`text-sm text-gray-500`}>Created: {formatDate(bill.createdAt)}</Text>
        {bill.updatedAt !== bill.createdAt && (
          <Text style={tw`text-sm text-gray-500`}>Last updated: {formatDate(bill.updatedAt)}</Text>
        )}
      </View>
    </ScrollView>
  );
}
