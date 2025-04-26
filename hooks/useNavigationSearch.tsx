import { colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { SearchBarProps } from "react-native-screens";

const defaultSearchBarOptions = {
  tintColor: colors.primary,
  hideWhenScrooling: false,
};

export const useNavigationSearch = ({
  searchBarOptions,
}: {
  searchBarOptions?: SearchBarProps;
}) => {
  const [search, setSearch] = useState("");

  const navigation = useNavigation();
  const HandleOnChangeText: SearchBarProps["onChangeText"] = ({
    nativeEvent: { text },
  }) => {
    setSearch(text);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        ...defaultSearchBarOptions,
        ...searchBarOptions,
        onChangeText: HandleOnChangeText,
      },
    });
  }, [navigation, searchBarOptions]);

  return search;
};
