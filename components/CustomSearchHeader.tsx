import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { tw } from "@/libs";

export const CustomSearchHeader = ({
  onSearch,
  placeholder = "Search...",
}: {
  onSearch: (text: string) => void;
  placeholder?: string;
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);

  const clearText = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <View
      style={tw`flex-row items-center bg-gray-400/30 rounded-full px-3 my-3 shadow-sm`}
    >
      <Feather name="search" size={20} color="#fff" style={tw`mr-2`} />
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor="#ddd"
        value={value}
        onChangeText={setValue}
        style={tw`flex-1 text-white text-base`}
      />
      {value.length > 0 && (
        <Pressable
          hitSlop={10}
          onPress={(e) => {
            e.stopPropagation();
            clearText();
          }}
        >
          <Ionicons
            name="close-circle"
            size={24}
            color="#fff"
            style={tw`ml-2`}
          />
        </Pressable>
      )}
    </View>
  );
};
