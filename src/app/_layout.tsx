import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MarketProvider } from "../store";
export default function Layout() {
  return (
    <SafeAreaProvider>
      <MarketProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </MarketProvider>
    </SafeAreaProvider>
  );
}
