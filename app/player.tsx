import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Image } from "expo-image";
import { formatTime, tw } from "@/libs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { defaultStyles } from "@/constants/Style";
import { colors, fontSize, screenPadding } from "@/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import { Easing } from "react-native";
import { transform } from "lodash";

const { width } = Dimensions.get("window");
const AnimatedImage = Animated.createAnimatedComponent(Image);

const PlayerScreen = () => {
  const {
    progress,
    currentTrack,
    isPlaying,
    duration,
    togglePlayPause,
    playNext,
    playPrev,
    seekTo,
  } = usePlayerStore();
  const router = useRouter();

  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (isPlaying) {
      rotateAnim.setValue(0);
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
          isInteraction: false,
        })
      );
      animation.start();
    } else {
      rotateAnim.stopAnimation();
    }

    return () => {
      animation?.stop();
    };
  }, [isPlaying]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.overlayContainer}>
      <DismissPlayerSymbol />
      <TouchableOpacity
        onPress={() => router.back()}
        style={tw`absolute top-4 right-4 z-10`}
      >
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <View
        style={[
          tw`w-64 h-64 rounded-full mb-8 items-center justify-center`,
          { overflow: "hidden" },
        ]}
      >
        <AnimatedImage
          source={{ uri: currentTrack?.artwork }}
          style={[
            tw`w-64 h-64`,
            { transform: [{ rotate }], resizeMode: "cover" },
          ]}
          contentFit="cover"
        />
      </View>

      <Text style={tw`text-white text-xl font-bold text-center px-4`}>
        {currentTrack?.title}
      </Text>
      <Text style={tw`text-gray-300 text-sm text-center px-4`}>
        {currentTrack?.artist}
      </Text>

      <LottieView
        source={require("../assets/icon/music-playing-2.json")}
        autoPlay
        loop
        style={tw`w-full h-12 mt-10`}
      />

      <View style={tw`w-full`}>
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

      <View style={tw`mt-4 flex-row items-center justify-center gap-12`}>
        <TouchableOpacity onPress={playPrev}>
          <Ionicons name="play-skip-back" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={64}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DismissPlayerSymbol = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: top + 8,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View
        accessible={false}
        style={{
          width: 50,
          height: 8,
          borderRadius: 8,
          backgroundColor: "#fff",
          opacity: 0.7,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  artworkImageContainer: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: "row",
    justifyContent: "center",
    height: "45%",
  },
  artworkImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: "hidden",
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  trackArtistText: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    maxWidth: "90%",
  },
});

export default PlayerScreen;
