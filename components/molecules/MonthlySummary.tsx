import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

import { DefaultComponentProps } from "../../types";
import { MonthlyStats } from "../../types/bill";

type Props = DefaultComponentProps & {
  stats: MonthlyStats;
};

export function MonthlySummary(props: Props) {
  const { stats, style } = props;

  return (
    <View style={[tw`mb-4 rounded-lg bg-white p-4`, style]}>
      <Text style={tw`mb-2 text-lg font-semibold`}>Monthly Summary</Text>

      <View style={tw`mb-2 flex-row items-center justify-between`}>
        <Text style={tw`text-gray-600`}>Total Bills:</Text>
        <Text style={tw`font-bold`}>${stats.totalAmount.toFixed(2)}</Text>
      </View>

      <View style={tw`mb-2 flex-row items-center justify-between`}>
        <Text style={tw`text-gray-600`}>Paid:</Text>
        <Text style={tw`font-bold text-green-600`}>${stats.paidAmount.toFixed(2)}</Text>
      </View>

      <View style={tw`mb-4 flex-row items-center justify-between`}>
        <Text style={tw`text-gray-600`}>Unpaid:</Text>
        <Text style={tw`font-bold text-red-600`}>${stats.unpaidAmount.toFixed(2)}</Text>
      </View>

      <View style={tw`h-2 w-full overflow-hidden rounded-full bg-gray-200`}>
        <View
          style={[tw`h-full rounded-full bg-teal-500`, { width: `${stats.paidPercentage}%` }]}
        />
      </View>

      <Text style={tw`mt-2 text-center text-gray-600`}>{stats.paidPercentage}% paid</Text>
    </View>
  );
}
