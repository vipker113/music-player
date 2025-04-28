import { Text, View } from "react-native";
import { Menu, MenuItem } from "react-native-material-menu";
import React, { useState } from "react";
import { tw } from "@/libs";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Seperator from "./Seperator";

const Dropdown = () => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const MenuItemWithIcon = ({
    title,
    iconName,
    onPress,
  }: {
    title: string;
    iconName?: typeof Ionicons.defaultProps;
    onPress: () => void;
  }) => (
    <MenuItem onPress={onPress} style={tw`rounded-3xl py-2 w-48 px-4`}>
      <View style={tw`flex-row w-full justify-between items-center`}>
        <Text style={tw`text-base text-slate-800`}>{title}</Text>
        <Ionicons name={iconName} size={20} style={tw`text-slate-500 ml-2`} />
      </View>
    </MenuItem>
  );
  return (
    <View>
      <Menu
        visible={visible}
        anchor={
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color="white"
            onPress={showMenu}
          />
        }
        onRequestClose={hideMenu}
        style={tw`mt-10 rounded-3xl`}
      >
        <MenuItemWithIcon
          title="Statement"
          iconName="document-text-outline"
          onPress={hideMenu}
        />
        <Seperator />
        <MenuItemWithIcon
          title="Settings"
          iconName="settings-outline"
          onPress={hideMenu}
        />
        <Seperator />
        <MenuItemWithIcon
          title="Log Out"
          iconName="log-out-outline"
          onPress={hideMenu}
        />
      </Menu>
    </View>
  );
};

export default Dropdown;
