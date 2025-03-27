import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Clear all AsyncStorage data
 * Useful for debugging and testing
 */
export const clearAllStorageData = async (): Promise<void> => {
  try {
    console.log("Clearing all AsyncStorage data");
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully");
    return Promise.resolve();
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
    return Promise.reject(error);
  }
};

/**
 * View all keys in AsyncStorage
 * Useful for debugging
 */
export const getAllStorageKeys = async (): Promise<readonly string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log("AsyncStorage keys:", keys);
    return keys;
  } catch (error) {
    console.error("Error getting AsyncStorage keys:", error);
    return [];
  }
};

/**
 * View all data in AsyncStorage
 * Useful for debugging
 */
export const getAllStorageData = async (): Promise<Record<string, any>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    const result: Record<string, any> = {};

    items.forEach(([key, value]) => {
      try {
        result[key] = value ? JSON.parse(value) : null;
      } catch (e) {
        result[key] = value;
      }
    });

    console.log("AsyncStorage data:", result);
    return result;
  } catch (error) {
    console.error("Error getting AsyncStorage data:", error);
    return {};
  }
};
