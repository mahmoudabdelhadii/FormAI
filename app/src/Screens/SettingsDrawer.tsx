import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const SettingsDrawer: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Settings</Text>
    </View>
  );
};

export default SettingsDrawer;
