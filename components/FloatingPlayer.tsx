import React, { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { usePlayerStore } from "@/store/usePlayerStore";
import { unknownTrackImageUri } from "@/constants/images";
import { Image } from "expo-image";
import { tw } from "@/libs";
import { colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { formatTime } from "@/libs/helper";

export const FloatingPlayer = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isLoading = usePlayerStore((state) => state.isLoading);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const cleanup = usePlayerStore((state) => state.cleanup);

  const repeatMode = usePlayerStore((state) => state.repeatMode);
  const toggleRepeatMode = usePlayerStore((state) => state.toggleRepeatMode);

  const progress = usePlayerStore((state) => state.progress);
  const duration = usePlayerStore((state) => state.duration);
  const seekTo = usePlayerStore((state) => state.seekTo);

  const playNext = usePlayerStore((state) => state.playNext);
  const playPrev = usePlayerStore((state) => state.playPrev);

  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios" ? 49 + insets.bottom : 56;

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!currentTrack) return null;

  const renderButtonRepeatMode = (
    mode: "off" | "repeat-one" | "repeat-all" | "shuffle"
  ) => {
    switch (mode) {
      case "repeat-one":
        return (
          <MaterialCommunityIcons name="repeat-once" size={24} color={"#fff"} />
        );
      case "repeat-all":
        return (
          <MaterialCommunityIcons name="repeat" size={24} color={"#fff"} />
        );
      case "shuffle":
        return <Ionicons name="shuffle" size={24} color="#fff" />;
      default:
        return (
          <MaterialCommunityIcons name="repeat-off" size={24} color={"#fff"} />
        );
    }
  };

  return (
    <View
      style={[
        tw`absolute mx-4 left-0 right-0 bg-gray-800 p-2 items-center shadow-lg rounded-lg`,
        {
          bottom: insets.bottom + tabBarHeight,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <View style={tw`flex-row items-center justify-between w-full`}>
        <Image
          source={{ uri: currentTrack.artwork || unknownTrackImageUri }}
          style={tw`w-10 h-10 rounded-lg`}
        />
        <View style={tw`flex-1 ml-2`}>
          <Text
            style={tw`text-lg font-semibold pl-2 text-white`}
            numberOfLines={1}
          >
            {currentTrack.title}
          </Text>
          {currentTrack.artist && (
            <Text style={tw`text-sm pl-2 text-gray-400`} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={toggleRepeatMode} style={tw`p-3`}>
          {renderButtonRepeatMode(repeatMode)}
        </TouchableOpacity>
      </View>
      <View style={tw`w-full mt-2`}>
        <Slider
          value={progress}
          minimumValue={0}
          maximumValue={duration || 1}
          onSlidingComplete={seekTo}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor="#999"
          thumbTintColor={colors.primary}
          style={{ height: 30 }}
        />
        <View style={tw`flex-row justify-between px-2`}>
          <Text style={tw`text-xs text-gray-400`}>{formatTime(progress)}</Text>
          <Text style={tw`text-xs text-gray-400`}>{formatTime(duration)}</Text>
        </View>
      </View>
      <View
        style={tw`flex-row items-center justify-between w-[60%] self-center mt-2`}
      >
        <TouchableOpacity onPress={playPrev} style={tw`p-2`}>
          <MaterialIcons name="skip-previous" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlayPause}
          disabled={isLoading}
          style={tw`p-2`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext} style={tw`p-2`}>
          <MaterialIcons name="skip-next" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
