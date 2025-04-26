import { StackScreenWithSearchBar } from "@/constants/Layout";
import { Stack } from "expo-router";

const FavoritesScreen = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ ...StackScreenWithSearchBar, title: "Favorites" }}
      />
    </Stack>
  );
};

export default FavoritesScreen;
