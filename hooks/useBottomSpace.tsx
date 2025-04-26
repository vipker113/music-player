import { useMemo } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { usePlayerStore } from "@/store/usePlayerStore";

export const useBottomSpace = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  // Tính chiều cao của tab bar
  const tabBarHeight = Platform.OS === "ios" ? 49 + insets.bottom : 56;

  // Tính chiều cao của floating player (nếu có)
  // Giả sử chiều cao cơ bản của player là 60px + padding
  const playerHeight = currentTrack ? 60 + insets.bottom + 16 : 0;

  // Tổng khoảng cách cần thiết ở dưới
  const bottomSpace = useMemo(() => {
    return tabBarHeight + (currentTrack ? playerHeight : 0);
  }, [tabBarHeight, currentTrack, playerHeight]);

  return {
    bottomSpace,
    tabBarHeight,
    playerHeight,
    headerHeight,
  };
};
