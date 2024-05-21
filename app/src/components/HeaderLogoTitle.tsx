import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";

const StyledView = styled(View);
const LogoTitle = () => {
  return (
    <StyledView className="flex flex-row items-center gap-2">
      <Image
        source={require("../../src/assets/flexingLogo.png")} // Replace with your logo URL
        style={{ width: 35, height: 25 }}
      />
      <Image
        source={require("../../src/assets/logotext.png")} // Replace with your logo URL
        style={{ width: 100, height: 20 }}
      />
    </StyledView>
  );
};

export default LogoTitle;
