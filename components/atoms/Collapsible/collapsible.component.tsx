import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { ThemedText } from "../../atoms/ThemedText";
import { ThemedView } from "../../atoms/ThemedView";
import { Colors } from "@/constants/Colors";

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
      >
        <Ionicons
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          name={isOpen ? "chevron-down" : "chevron-forward-outline"}
          size={18}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    marginLeft: 24,
    marginTop: 6,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
});
