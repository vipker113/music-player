import { StackScreenWithSearchBar } from "@/constants/Layout";
import { defaultStyles } from "@/constants/Style";
import { Stack } from "expo-router";
import { View } from "react-native";

const PlaylistScreen = () => {
  return (
    <View style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ ...StackScreenWithSearchBar, title: "Playlist" }}
        />
      </Stack>
    </View>
  );
};

export default PlaylistScreen;
