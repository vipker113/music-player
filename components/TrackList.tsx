import React, { useState } from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
} from "react-native";
import { defaultStyles, utilsStyles } from "@/constants/Style";
import { colors, fontSize } from "@/constants/Colors";
import { Image } from "expo-image";
import { tw } from "@/libs";
import { usePlayerStore } from "@/store/usePlayerStore";
import { unknownTrackImageUri } from "@/constants/images";
import { useBottomSpace } from "@/hooks/useBottomSpace";
import Dropdown from "./Dropdown";
import { DropdownMenu, MenuOption } from "./CustomDropdown";
import { Track } from "@/apis/fetchChillhopYTB";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export type TrackListProps = Partial<FlatListProps<Track>> & {
  search: string;
  data?: Track[];
};

const ItemDivider = () => (
  <View
    style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }}
  />
);

const TrackList = ({ search = "", data, ...flatlistProps }: TrackListProps) => {
  const { tracks: storeTracks, playTrack, isLoading } = usePlayerStore();
  const { bottomSpace } = useBottomSpace();

  const tracksToUse = data || storeTracks;

  const filteredData = tracksToUse.filter((item: Track) => {
    const lowerSearch = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(lowerSearch) ||
      item.artist?.toLowerCase().includes(lowerSearch)
    );
  });

  if (isLoading && filteredData.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Đang tải nhạc...
        </Text>
      </View>
    );
  } else if (!isLoading && filteredData.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Không tìm thấy bài hát
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredData}
      ItemSeparatorComponent={ItemDivider}
      ListFooterComponent={ItemDivider}
      renderItem={({ item: track }) => (
        <TrackListItem track={track} onTrackSelect={playTrack} />
      )}
      keyExtractor={(item, index) => item.url || index.toString()}
      {...flatlistProps}
      style={{ marginBottom: bottomSpace }}
    />
  );
};

const TrackListItem = ({
  track,
  onTrackSelect,
}: {
  track: Track;
  onTrackSelect: (track: Track) => void;
}) => {
  const isActiveTrack = usePlayerStore(
    (state) => state.currentTrack?.url === track.url
  );

  const { isLoading, isPlaying } = usePlayerStore();

  return (
    <TouchableHighlight
      onPress={() => onTrackSelect(track)}
      disabled={isLoading}
      underlayColor={colors.background}
    >
      <View style={tw`flex-row items-center p-2`}>
        <View>
          <View style={tw`relative rounded-lg w-12 h-12`}>
            <Image
              source={{ uri: track.artwork || unknownTrackImageUri }}
              style={[
                tw`rounded-lg w-12 h-12`,
                { opacity: isActiveTrack ? 0.6 : 1 },
              ]}
            />
            {isActiveTrack &&
              (isPlaying ? (
                <LottieView
                  source={require("../assets/icon/music-playing.json")}
                  autoPlay
                  loop
                  style={styles.trackPlayingIconIndicator}
                />
              ) : (
                <Ionicons
                  style={styles.trackPausedIndicator}
                  name="play"
                  size={20}
                  color={colors.icon}
                />
              ))}
          </View>
        </View>
        <View style={tw`flex-1 flex-row items-center justify-between ml-4`}>
          <View style={tw`flex-1 justify-center`}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.trackTitleText,
                color: isActiveTrack ? colors.primary : colors.text,
              }}
            >
              {track.title}
            </Text>
            {track.artist && (
              <Text numberOfLines={1} style={styles.trackArtistText}>
                {track.artist}
              </Text>
            )}
          </View>
          <Dropdown />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  trackPlayingIconIndicator: {
    position: "absolute",
    width: 36,
    height: 36,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  trackPausedIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  trackArtistText: {
    ...defaultStyles.text,
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
});

export default TrackList;
