import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

import { DefaultComponentProps } from "../../types";

type Props = DefaultComponentProps & {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState(props: Props) {
  const { message, actionLabel, onAction, style } = props;

  return (
    <View style={[tw`flex-1 items-center justify-center p-8`, style]}>
      <View style={tw`mb-6 h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
        <Ionicons name="document-text-outline" size={40} color="#9ca3af" />
      </View>

      <Text style={tw`mb-4 text-center text-lg text-gray-700`}>{message}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity style={tw`mt-2 rounded-lg bg-teal-600 px-6 py-3`} onPress={onAction}>
          <Text style={tw`font-medium text-white`}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
