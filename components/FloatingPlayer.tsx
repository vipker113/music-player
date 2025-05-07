import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Pressable,
  PanResponder,
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
import { useRouter } from "expo-router";

export const FloatingPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    repeatMode,
    progress,
    duration,
    volume,
    togglePlayPause,
    toggleRepeatMode,
    cleanup,
    seekTo,
    playPrev,
    playNext,
    setVolume,
  } = usePlayerStore();

  const [tempVolume, setTempVolume] = useState(volume);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const volumeOpacity = useRef(new Animated.Value(0)).current;
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios" ? 49 + insets.bottom : 56;

  const [expanded, setExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoCollapse = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      collapse();
    }, 10000);
  }, []);

  const toggleExpand = () => {
    if (expanded) {
      collapse();
    } else {
      expand();
    }
    resetAutoCollapse();
  };

  const handleClose = useCallback(async () => {
    const { cleanup } = usePlayerStore.getState();
    await cleanup();
  }, []);

  const showVolumeSlider = () => {
    setIsVolumeVisible(!isVolumeVisible);

    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }

    Animated.timing(volumeOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    volumeTimeoutRef.current = setTimeout(() => {
      hideVolumeSlider();
    }, 3000);
  };

  const hideVolumeSlider = () => {
    Animated.timing(volumeOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVolumeVisible(false);
    });
  };

  const expand = () => {
    setExpanded(true);
    setIsVolumeVisible(false);
    Animated.timing(animatedHeight, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleVolumeChange = (val: number | number[]) => {
    const newVolume = Array.isArray(val) ? val[0] : val;
    setTempVolume(newVolume);
    setVolume(newVolume);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    volumeTimeoutRef.current = setTimeout(() => {
      hideVolumeSlider();
    }, 3000);
  };

  const collapse = () => {
    setExpanded(false);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    resetAutoCollapse();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    expand();
  }, [currentTrack]);

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

  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) {
          panY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -50) {
          router.navigate("/player");

          setTimeout(() => {
            panY.setValue(0);
          }, 300);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        tw`absolute mx-4 bg-slate-700 p-2 items-center shadow-lg rounded-lg z-10`,
        {
          transform: [{ translateY: panY }],
          overflow: isVolumeVisible ? "visible" : "hidden",
          bottom: insets.bottom + tabBarHeight + 8,
          left: 0,
          right: 0,
        },
      ]}
    >
      <Pressable
        style={[tw`w-full`]}
        onPress={() => {
          router.navigate("/player");
        }}
      >
        <View style={tw`flex-row items-center justify-between`}>
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

          <TouchableOpacity onPress={toggleRepeatMode} style={tw`p-2`}>
            {renderButtonRepeatMode(repeatMode)}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleExpand} style={tw`p-2`}>
            <Ionicons
              name={expanded ? "chevron-down" : "chevron-up"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose} style={tw`p-2`}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            position: "relative",
            overflow: expanded ? "visible" : "hidden",
            zIndex: 10,
            width: "100%",
            height: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100],
            }),
          }}
        >
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
              <Text style={tw`text-xs text-gray-400`}>
                {formatTime(progress)}
              </Text>
              <Text style={tw`text-xs text-gray-400`}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          <View style={tw`flex-row items-center justify-between gap-2 mt-2`}>
            <View style={tw`flex-row flex-1 items-center justify-between`}>
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
                    color={"white"}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={playNext} style={tw`p-2`}>
                <MaterialIcons name="skip-next" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View
              style={tw`relative flex-row min-w-[80px] justify-center items-center ml-2`}
            >
              <TouchableOpacity style={tw`p-2`} onPress={showVolumeSlider}>
                <Ionicons
                  name={
                    tempVolume === 0
                      ? "volume-mute"
                      : tempVolume < 0.55
                      ? "volume-low"
                      : "volume-high"
                  }
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              {isVolumeVisible && (
                <Animated.View
                  style={[
                    tw`absolute bg-white z-10 w-[180px] h-[40px] rounded-lg py-2 px-1`,
                    {
                      opacity: volumeOpacity,
                      top: -120,
                      transform: [{ rotate: "-90deg" }],
                    },
                  ]}
                >
                  <Slider
                    value={tempVolume}
                    onValueChange={handleVolumeChange}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    thumbTintColor={colors.primary}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor="#ccc"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};
