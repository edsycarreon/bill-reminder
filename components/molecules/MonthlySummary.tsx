import React from "react";
import { View, Text } from "react-native";
import { tw } from "../../tailwind";

import { DefaultComponentProps } from "../../types";
import { MonthlyStats } from "../../types/bill";
import { useTheme } from "../../utils/themeContext";

type Props = DefaultComponentProps & {
  stats: MonthlyStats;
};

export function MonthlySummary(props: Props) {
  const { stats, style } = props;
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        tw`mb-6 rounded-2xl p-5`,
        isDarkMode ? tw`bg-gray-900` : tw`bg-white`,
        {
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        style,
      ]}
    >
      <Text style={tw`mb-4 text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        Monthly Overview
      </Text>

      <View style={tw`mb-6 flex-row justify-between`}>
        <View style={tw`items-center`}>
          <Text
            style={tw`mb-1 text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Amount Due
          </Text>
          <Text style={tw`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            ₱{stats.totalAmount.toFixed(2)}
          </Text>
        </View>

        <View style={tw`items-center`}>
          <Text
            style={tw`mb-1 text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Paid
          </Text>
          <Text style={tw`text-2xl font-bold text-green-600`}>₱{stats.paidAmount.toFixed(2)}</Text>
        </View>

        <View style={tw`items-center`}>
          <Text
            style={tw`mb-1 text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Unpaid
          </Text>
          <Text style={tw`text-2xl font-bold text-red-600`}>₱{stats.unpaidAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={tw`mb-2`}>
        <View style={tw`mb-2 flex-row items-center justify-between`}>
          <Text style={tw`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Payment Progress
          </Text>
          <Text style={tw`text-sm font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {stats.paidPercentage}%
          </Text>
        </View>

        <View
          style={tw`h-3 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
        >
          <View
            style={[
              tw`h-full rounded-full bg-teal-500`,
              { width: `${stats.paidPercentage}%` },
              stats.paidPercentage === 100 && tw`bg-green-500`,
            ]}
          />
        </View>

        <View style={tw`mt-3 flex-row items-center justify-center`}>
          <View style={tw`mr-2 flex-row items-center`}>
            <View style={tw`mr-1 h-3 w-3 rounded-full bg-teal-500`} />
            <Text style={tw`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              In Progress
            </Text>
          </View>
          <View style={tw`ml-2 flex-row items-center`}>
            <View style={tw`mr-1 h-3 w-3 rounded-full bg-green-500`} />
            <Text style={tw`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Completed
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
