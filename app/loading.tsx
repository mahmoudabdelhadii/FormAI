import React from "react";
import { View, Image } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledImage = styled(Image);

const LoadingScreen: React.FC = () => {
  return (
    <StyledView className="flex-1 flex-col justify-around items-center bg-[#048998]">
      <StyledImage
        className="w-9/10 h-2/5"
        resizeMode="contain"
        source={require("./src/assets/flexingLogo.png")}
      />
      <StyledImage
        className="w-9/10 h-2/5"
        source={require("./src/assets/logo.gif")}
      />
    </StyledView>
  );
};

export default LoadingScreen;
