import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ darkColor, lightColor, style, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ dark: darkColor, light: lightColor }, "background");

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
