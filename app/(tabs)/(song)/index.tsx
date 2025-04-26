import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Style";
import TrackList from "@/components/TrackList";
import { screenPadding } from "@/constants/Colors";
import { CustomSearchHeader } from "@/components/CustomSearchHeader";

const Song = () => {
  const [search, setSearch] = useState("");

  return (
    <View style={defaultStyles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        style={{
          paddingHorizontal: screenPadding.horizontal,
        }}
      >
        <CustomSearchHeader
          onSearch={setSearch}
          placeholder="Find in Songs..."
        />
        <TrackList search={search} scrollEnabled={false} />
      </ScrollView>
    </View>
  );
};

export default Song;
