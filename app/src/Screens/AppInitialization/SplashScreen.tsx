import React from "react";
import { View, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
import { styled } from "nativewind";

interface PreSplashProps {
  onAnimationComplete: () => void; // Callback when animation finishes
  isFetchingUser: boolean;
}

const StyledView = styled(View);
const StyledActivityIndicator = styled(ActivityIndicator);

const PreSplash: React.FC<PreSplashProps> = ({
  onAnimationComplete,
  isFetchingUser,
}) => {
  return (
    <StyledView className="flex-1 justify-center items-center bg-[#048998]">
      <LottieView
        source={require("../../assets/splash-pre.lottie.json")}
        autoPlay
        loop={false}
        style={{ width: "100%", height: "100%" }}
        onAnimationFinish={onAnimationComplete} // Triggering the callback
      />
      {isFetchingUser && (
        <StyledView className="absolute w-full h-full bg-transparent justify-center items-center pt-[400px]">
          <StyledActivityIndicator size="large" color="#FFFFFF" />
        </StyledView>
      )}
    </StyledView>
  );
};

const PostSplash: React.FC = () => {
  return (
    <StyledView className="flex-1 justify-center items-center bg-[#048998]">
      <LottieView
        source={require("../../assets/splash-post.lottie.json")} // Loading final animation
        autoPlay
        loop={false}
        style={{ width: "100%", height: "100%" }}
        onAnimationFinish={() => {
          console.log("app init done");
        }}
      />
    </StyledView>
  );
};

export { PreSplash, PostSplash };
