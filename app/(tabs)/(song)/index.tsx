import { View, ScrollView, RefreshControl } from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Style";
import TrackList from "@/components/TrackList";
import { screenPadding } from "@/constants/Colors";
import { CustomSearchHeader } from "@/components/CustomSearchHeader";
import { usePlayerStore } from "@/store/usePlayerStore";

const Song = () => {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { tracks, fetchTracks } = usePlayerStore();

  const onRefresh = async () => {
    setRefreshing(true);

    await new Promise((resolve) => {
      fetchTracks();
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    setRefreshing(false);
  };

  return (
    <View style={defaultStyles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={["#fff"]}
          />
        }
        style={{
          paddingHorizontal: screenPadding.horizontal,
        }}
      >
        <CustomSearchHeader
          onSearch={setSearch}
          placeholder="Find in Songs..."
        />
        <TrackList search={search} data={tracks} scrollEnabled={false} />
      </ScrollView>
    </View>
  );
};

export default Song;
