import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);

const ProfileTab: React.FC = () => {
  return (
    <StyledSafeAreaView className="flex-1 justify-around items-center bg-white">
      <StyledText>Profile Tab</StyledText>
    </StyledSafeAreaView>
  );
};

export default ProfileTab;
