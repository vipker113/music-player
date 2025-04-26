import { StackScreenWithSearchBar } from "@/constants/Layout";
import { Stack } from "expo-router";

const SongScreen = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          ...StackScreenWithSearchBar,
          title: "Song",
        }}
      />
    </Stack>
  );
};

export default SongScreen;
