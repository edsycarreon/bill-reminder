import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { format } from "date-fns";
import { tw } from "../../tailwind";
import { Ionicons } from "@expo/vector-icons";

import { DefaultComponentProps } from "../../types";
import { BillWithStatus } from "../../types/bill";
import { formatMonthName } from "../../utils/dateUtils";
import { useTheme } from "../../utils/themeContext";

type Props = DefaultComponentProps & {
  bill: BillWithStatus;
  history: Array<{ month: string; paid: boolean; paidDate: string | null }>;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePaid: (paid: boolean) => void;
};

export function BillDetails(props: Props) {
  const { bill, history, onEdit, onDelete, onTogglePaid, style } = props;
  const { isDarkMode } = useTheme();

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

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <View style={tw`mb-4 flex-row items-center justify-between`}>
      <Text style={tw`text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</Text>
      <Text style={tw`text-base font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        {value}
      </Text>
    </View>
  );

  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <View
      style={[
        tw`mb-6 rounded-2xl p-5 ${isDarkMode ? "bg-gray-800" : "bg-white"} ${className}`,
        {
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.05,
          shadowRadius: 4,
        },
      ]}
    >
      {children}
    </View>
  );

  return (
    <ScrollView style={[tw`flex-1`, style]} contentContainerStyle={tw`p-4`}>
      {/* Header */}
      <View style={tw`mb-6 flex-row items-start justify-between`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {bill.name}
          </Text>
          {bill.category && (
            <View style={tw`mt-2`}>
              <View
                style={tw`rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} px-3 py-1`}
              >
                <Text
                  style={tw`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {bill.category}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`mr-3 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} p-3`}
            onPress={onEdit}
          >
            <Ionicons name="pencil" size={22} color={isDarkMode ? "#5eead4" : "#0f766e"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`rounded-full ${isDarkMode ? "bg-red-900/30" : "bg-red-50"} p-3`}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={22} color={isDarkMode ? "#fda4af" : "#be123c"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Status */}
      <Card>
        <Text style={tw`mb-4 text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          Current Status
        </Text>

        <DetailRow label="Amount" value={`₱${(bill.actualAmount || bill.amount).toFixed(2)}`} />
        <DetailRow label="Due Date" value={getDueDateText()} />
        <DetailRow
          label="Reminder"
          value={`${bill.reminderDays} day${bill.reminderDays !== 1 ? "s" : ""} before due date`}
        />

        <View style={tw`my-4 h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`} />

        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Payment Status
          </Text>
          <View style={tw`flex-row items-center`}>
            <Text
              style={[
                tw`mr-3 text-base font-semibold`,
                bill.paid ? tw`text-green-400` : tw`text-red-400`,
              ]}
            >
              {bill.paid ? "Paid" : "Unpaid"}
            </Text>

            <TouchableOpacity
              style={[
                tw`h-8 w-8 items-center justify-center rounded-full border-2`,
                bill.paid
                  ? tw`border-green-500 bg-green-500`
                  : tw`${isDarkMode ? "border-gray-600" : "border-gray-300"}`,
              ]}
              onPress={() => onTogglePaid(!bill.paid)}
            >
              {bill.paid && <Ionicons name="checkmark" size={20} color="white" />}
            </TouchableOpacity>
          </View>
        </View>

        {bill.paid && bill.paidDate && (
          <Text
            style={tw`mt-2 text-right text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Paid on {formatDate(bill.paidDate)}
          </Text>
        )}
      </Card>

      {/* Description */}
      {bill.description && (
        <Card>
          <Text
            style={tw`mb-3 text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
          >
            Description
          </Text>
          <Text style={tw`text-base leading-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            {bill.description}
          </Text>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <Text style={tw`mb-4 text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          Payment History
        </Text>

        {history.length > 0 ? (
          history.map((item, index) => (
            <View
              key={item.month}
              style={[
                tw`flex-row items-center justify-between py-3`,
                index < history.length - 1 &&
                  tw`border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`,
              ]}
            >
              <Text
                style={tw`text-base font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {formatMonthName(item.month)}
              </Text>
              <View style={tw`flex-row items-center`}>
                {item.paid ? (
                  <>
                    <Text
                      style={tw`mr-2 font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                    >
                      Paid
                    </Text>
                    <View
                      style={tw`rounded-full ${isDarkMode ? "bg-green-900/30" : "bg-green-100"} p-1`}
                    >
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={isDarkMode ? "#4ade80" : "#16a34a"}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={tw`mr-2 font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Not paid
                    </Text>
                    <View
                      style={tw`rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} p-1`}
                    >
                      <Ionicons name="close" size={16} color={isDarkMode ? "#6b7280" : "#9ca3af"} />
                    </View>
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={tw`py-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No payment history available
          </Text>
        )}
      </Card>

      {/* Creation Info */}
      <View style={tw`mt-2 rounded-lg p-4`}>
        <Text style={tw`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          Created: {formatDate(bill.createdAt)}
        </Text>
        {bill.updatedAt !== bill.createdAt && (
          <Text style={tw`mt-1 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Last updated: {formatDate(bill.updatedAt)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
