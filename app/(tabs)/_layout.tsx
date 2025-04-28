import React from "react";
import { Tabs } from "expo-router";
import { colors, fontSize } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { usePlayerStore } from "@/store/usePlayerStore";

const TabNavigation = () => {
  const { currentTrack } = usePlayerStore();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: "white",
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
            fontWeight: 500,
          },
          tabBarStyle: {
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0,
            height: "auto",
          },
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              style={{
                ...StyleSheet.absoluteFillObject,
                overflow: "hidden",
                backgroundColor: colors.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                opacity: 0.9,
                // filter: "blur(2px)",
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="heart" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            title: "Playlist",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="playlist-play"
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(song)"
          options={{
            title: "Song",
            tabBarIcon: ({ color }) => (
              <Ionicons name="musical-notes-sharp" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="artists"
          options={{
            title: "Artists",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="users-line" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      {currentTrack && <FloatingPlayer />}
    </>
  );
};

export default TabNavigation;
