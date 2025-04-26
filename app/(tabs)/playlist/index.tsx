import { View, Text } from "react-native";
import React from "react";
import { defaultStyles } from "@/constants/Style";

const Playlist = () => {
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.text}>Playlist</Text>
    </View>
  );
};

export default Playlist;
