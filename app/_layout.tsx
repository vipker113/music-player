import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen } from "expo-router";
import { usePlayerStore } from "@/store/usePlayerStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fetchTracks, tracks } = usePlayerStore();
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");

    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  useEffect(() => {
    if (tracks.length === 0) {
      fetchTracks();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
