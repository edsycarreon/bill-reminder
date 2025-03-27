import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import tw from "twrnc";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
