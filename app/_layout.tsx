import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen } from "expo-router";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fetchTracks, tracks } = usePlayerStore();
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");

    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        if (tracks.length === 0) {
          await fetchTracks();
        }
      } catch (error) {
        console.error("Failed to setup audio mode", error);
      }
    };
    setupAudio();
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
