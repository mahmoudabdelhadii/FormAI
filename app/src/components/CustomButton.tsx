import React from "react";
import { Pressable, Text, Animated } from "react-native";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.View);

interface CustomButtonProps {
  text: string;
  variant?: "primary" | "secondary";
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  variant = "primary",
  onPress,
  disabled = false,
}) => {
  const expand = React.useRef(new Animated.Value(0)).current;

  const expandUp = () => {
    Animated.spring(expand, {
      toValue: 5,
      useNativeDriver: true,
    }).start();
  };

  const expandDown = () => {
    Animated.spring(expand, {
      toValue: -5,
      bounciness: 12,
      useNativeDriver: true,
    }).start();
  };

  return (
    <StyledAnimatedView
      style={{
        transform: [{ translateY: expand }],
      }}
      className="w-full"
    >
      <StyledPressable
        onPressIn={expandUp}
        onPressOut={expandDown}
        onPress={onPress}
        disabled={disabled}
        className={`py-3.5 rounded-full ${
          variant === "primary"
            ? "bg-[#035c66]"
            : "bg-[#f6f5f5] border border-[#035c66]"
        } justify-center items-center`}
      >
        <StyledText
          className={`text-lg ${
            variant === "primary" ? "text-[#f6f5f5]" : "text-[#035c66]"
          }`}
        >
          {text}
        </StyledText>
      </StyledPressable>
    </StyledAnimatedView>
  );
};

export default CustomButton;
