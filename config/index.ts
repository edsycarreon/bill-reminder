import { Platform } from "react-native";

const CONFIG = {
  API_BASE_URL: process.env.PUBLIC_EXPO_API_BASE_URL,
  IS_ANDROID: Platform.OS === "android",
  IS_IOS: Platform.OS === "ios",
  IS_LIVE: process.env.PUBLIC_EXPO_IS_LIVE,
};

export default CONFIG;
