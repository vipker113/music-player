import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { colors } from "./Colors";

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
  headerLargeTitle: true,
  headerLargeStyle: {
    backgroundColor: colors.background,
  },
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerLargeTitleStyle: {
    color: colors.text,
  },
  headerTintColor: colors.text,
  headerBlurEffect: "prominent",
  headerShadowVisible: false,
};
