import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LogoTitle from "../components/HeaderLogoTitle";
import MessagingIcon from "../components/HeaderMessagingIcon";
import CameraIcon from "../components/HeaderCameraIcon";
import { styled } from "nativewind";

const StyledView = styled(View);
const Header = () => {
  return (
    <StyledView className="flex flex-row justify-between bg-[#048998] items-end pt-14 pb-4">
      <CameraIcon />
      <LogoTitle />
      <MessagingIcon />
    </StyledView>
  );
};

export default Header;
