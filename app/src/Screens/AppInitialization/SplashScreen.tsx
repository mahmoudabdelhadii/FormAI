import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, Animated } from "react-native";
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

interface PostSplashProps {
  onAnimationComplete: () => void; // Callback when animation finishes
}

const PostSplash: React.FC<PostSplashProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Duration of the fade-out effect
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 1500); // Assuming the original animation duration is 2 seconds

    return () => clearTimeout(timeout);
  }, [fadeAnim, onAnimationComplete]);

  return (
    <StyledView className="flex-1 justify-center items-center bg-[#048998]">
      <Animated.View
        style={{ width: "100%", height: "100%", opacity: fadeAnim }}
      >
        <LottieView
          source={require("../../assets/splash-post.lottie.json")} // Loading final animation
          autoPlay
          loop={false}
          style={{ width: "100%", height: "100%" }}
          onAnimationFinish={() => {}}
        />
      </Animated.View>
    </StyledView>
  );
};

export { PreSplash, PostSplash };
