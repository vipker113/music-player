import { StackScreenWithSearchBar } from "@/constants/Layout";
import { Stack } from "expo-router";

const ArtistsScreen = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ ...StackScreenWithSearchBar, title: "Artists" }}
      />
    </Stack>
  );
};

export default ArtistsScreen;
