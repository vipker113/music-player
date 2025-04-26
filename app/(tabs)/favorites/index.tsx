import { View, Text } from "react-native";
import React from "react";
import { defaultStyles } from "@/constants/Style";

const Favorite = () => {
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.text}>Favorite</Text>
    </View>
  );
};

export default Favorite;
