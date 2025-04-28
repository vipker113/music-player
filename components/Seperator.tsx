import { View, StyleSheet } from "react-native";
import React from "react";
import { tw } from "@/libs";

const Seperator = ({ style }: { style?: any }) => {
  return (
    <View
      style={[
        tw`flex-1 bg-lightGray`,
        { height: StyleSheet.hairlineWidth },
        style,
      ]}
    />
  );
};

export default Seperator;
