import React, { useEffect, useState, useRef } from "react";
import { Stack } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { tw } from "../tailwind";
import { useBillStore } from "../stores/billStore";
import { DebugStorage } from "../components/molecules/DebugStorage";
import { getAllStorageKeys } from "../utils/storageUtils";
import { ThemeToggle } from "../components/molecules/ThemeToggle";
import { ThemeProvider, useTheme } from "../utils/themeContext";

import "../global.css";

// Create a StoreInitializer component to ensure store is hydrated before rendering the app
function StoreInitializer({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hydrationAttempts, setHydrationAttempts] = useState(0);
  const { _hasHydrated, setHasHydrated } = useBillStore();
  const hydrationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hydrationInProgressRef = useRef(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const MAX_ATTEMPTS = 20; // 2 seconds (100ms * 20)

    // Check if AsyncStorage has our store data on mount
    const checkAsyncStorage = async () => {
      try {
        const keys = await getAllStorageKeys();
        console.log("AsyncStorage keys on app start:", keys);

        if (!keys.includes("bill-storage")) {
          console.log("Bill storage key not found in AsyncStorage, app may be starting fresh");
        }
      } catch (error) {
        console.error("Error checking AsyncStorage:", error);
      }
    };

    checkAsyncStorage();

    // Only initialize hydration if it's not already in progress
    if (!hydrationInProgressRef.current) {
      hydrationInProgressRef.current = true;

      // Use interval instead of recursive setTimeout for cleaner cleanup
      hydrationIntervalRef.current = setInterval(() => {
        setHydrationAttempts((prev) => {
          const newAttempts = prev + 1;

          // Check if the store has hydrated or we've reached max attempts
          if (_hasHydrated) {
            console.log(`Store hydrated successfully after ${newAttempts} attempts`);
            clearInterval(hydrationIntervalRef.current!);
            setIsLoading(false);
          } else if (newAttempts >= MAX_ATTEMPTS) {
            // If we've waited too long, manually set hydrated and proceed
            console.log(
              `Store hydration timed out after ${newAttempts} attempts, proceeding anyway`,
            );
            setHasHydrated(true);
            clearInterval(hydrationIntervalRef.current!);
            setIsLoading(false);
          } else {
            console.log(`Waiting for store hydration... (attempt ${newAttempts}/${MAX_ATTEMPTS})`);
          }

          return newAttempts;
        });
      }, 100);
    }

    // Clean up the interval when component unmounts
    return () => {
      if (hydrationIntervalRef.current) {
        clearInterval(hydrationIntervalRef.current);
      }
    };
  }, [_hasHydrated, setHasHydrated]); // Don't include hydrationAttempts here

  if (isLoading) {
    return (
      <View
        style={tw`flex-1 items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={tw`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Loading your bills...
        </Text>
        <Text style={tw`mt-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Hydration attempts: {hydrationAttempts}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

function AppLayout() {
  const { isDarkMode } = useTheme();

  // Log the current theme state
  useEffect(() => {
    console.log("Current theme state:", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const screenBackground = isDarkMode ? "bg-gray-900" : "bg-gray-50";

  return (
    <View style={tw`flex-1 ${screenBackground}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
          },
          headerTintColor: isDarkMode ? "#f3f4f6" : "#111827",
          headerShadowVisible: false,
          headerRight: () => <ThemeToggle style={tw`mr-4`} />,
          contentStyle: {
            backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
          },
          animation: "fade",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Bill Reminder",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="bill/add"
          options={{
            title: "Add Bill",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="bill/[id]"
          options={{
            title: "Bill Details",
          }}
        />
        <Stack.Screen
          name="bill/edit/[id]"
          options={{
            title: "Edit Bill",
            presentation: "modal",
          }}
        />
      </Stack>

      {/* Debug storage component for development and troubleshooting */}
      <DebugStorage />
    </View>
  );
}

// Wrap the entire app with a themed background
function ThemedApp() {
  const { isDarkMode } = useTheme();
  return (
    <View style={[tw`flex-1`, { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }]}>
      <AppLayout />
    </View>
  );
}

export default function RootLayout() {
  const { isDarkMode } = useTheme();
  return (
    <ThemeProvider>
      <StoreInitializer>
        <ThemedApp />
      </StoreInitializer>
    </ThemeProvider>
  );
}
