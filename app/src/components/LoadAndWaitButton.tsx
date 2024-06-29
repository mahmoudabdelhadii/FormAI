import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons"; // You can use any icon set
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface LoadAndErrorButtonProps {
  initialText: string;
  variant: "neutral" | "loading" | "error" | "success";
  setVariant: (variant: "neutral" | "loading" | "error" | "success") => void;
  onClick: () => void; // Added onClick prop
}

const LoadAndErrorButton: React.FC<LoadAndErrorButtonProps> = ({
  initialText,
  variant,
  setVariant,
  onClick, // Destructure onClick
}) => {
  const opacity = useSharedValue(1);
  const yOffset = useSharedValue(0);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (variant === "loading") {
      startLoadingAnimation();
    } else if (variant === "success" || variant === "error") {
      endLoadingAnimation();
      const timeout = setTimeout(() => {
        setVariant("neutral");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [variant]);

  const startLoadingAnimation = () => {
    opacity.value = withTiming(0, { duration: 300 });
    yOffset.value = withTiming(6, { duration: 300 });
    rotation.value = withTiming(360, {
      duration: 1500,
      easing: Easing.linear,
    });
    translateY.value = withTiming(-30, { duration: 300 });
  };

  const endLoadingAnimation = () => {
    opacity.value = withTiming(1, { duration: 300 });
    yOffset.value = withTiming(0, { duration: 300 });
    rotation.value = 0;
    translateY.value = withTiming(0, { duration: 300 });
  };

  const handleClick = () => {
    if (variant !== "neutral") return;
    setVariant("loading");
    onClick(); // Trigger the external onClick function
  };

  const buttonStyle =
    variant === "neutral"
      ? "bg-primary-dark hover:bg-primary-dark/80"
      : variant === "error"
      ? "bg-error"
      : variant === "success"
      ? "bg-success"
      : "bg-primary";

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: yOffset.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedButtonStyle} className="w-full">
      <StyledTouchableOpacity
        onPress={handleClick}
        className={`relative rounded-md px-4 font-medium w-full h-12 flex items-center justify-center text-foreground transition-all ${buttonStyle}`}
        disabled={variant !== "neutral"}
      >
        <Animated.View style={animatedTextStyle}>
          {variant === "neutral" && (
            <StyledText className="text-foreground">{initialText}</StyledText>
          )}
        </Animated.View>
        {variant === "loading" && (
          <Animated.View style={[{ position: "absolute" }, animatedIconStyle]}>
            <FontAwesome name="spinner" size={24} color="white" />
          </Animated.View>
        )}
        {variant === "error" && (
          <FontAwesome
            name="times"
            size={24}
            color="white"
            style={{ position: "absolute" }}
          />
        )}
        {variant === "success" && (
          <FontAwesome
            name="check"
            size={24}
            color="white"
            style={{ position: "absolute" }}
          />
        )}
      </StyledTouchableOpacity>
    </Animated.View>
  );
};

export default LoadAndErrorButton;
