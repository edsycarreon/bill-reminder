import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tw } from "../../tailwind";

import { DefaultComponentProps } from "../../types";

type Props = DefaultComponentProps & {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState(props: Props) {
  const { message, actionLabel, onAction, style } = props;

  return (
    <View
      style={[
        tw`flex-1 items-center justify-center rounded-2xl bg-white p-8`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        style,
      ]}
    >
      <View
        style={[
          tw`mb-6 h-24 w-24 items-center justify-center rounded-full bg-gray-50`,
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          },
        ]}
      >
        <Ionicons name="document-text-outline" size={48} color="#6B7280" />
      </View>

      <Text style={tw`mb-6 text-center text-lg font-medium text-gray-600`}>{message}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[
            tw`rounded-xl bg-teal-600 px-8 py-4`,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          ]}
          onPress={onAction}
        >
          <Text style={tw`text-base font-semibold text-white`}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
