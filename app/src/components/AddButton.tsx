import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import * as IconFontAwesome from "react-native-vector-icons/FontAwesome";
import * as MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/core";
import AnimatedHamburgerButton from "../components/UtilityButton"; // Make sure to adjust the path

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.View);
const StyledTouchableWithoutFeedback = styled(TouchableWithoutFeedback);

type TransformStyle = {
  transform: (
    | { translateX: Animated.AnimatedInterpolation<number> }
    | { translateY: Animated.AnimatedInterpolation<number> }
    | { scale: Animated.AnimatedInterpolation<number> }
  )[];
};

type CustomAddButtonProps = {
  color?: string;
  size?: number;
  onPress?: () => void;
  component?: boolean;
};

const CustomAddButton: React.FC<CustomAddButtonProps> = ({
  color = "#048998",
  size = 150,
  onPress,
  component = false,
}) => {
  const [isActive, setIsActive] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  const handlePress = () => {
    const newIsActive = !isActive;
    toggleButtons(newIsActive);
  };

  const toggleButtons = (open: boolean) => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsActive(open));

    if (!open && onPress) {
      onPress();
    }
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const directionalTransform = (
    direction: "left" | "right" | "top" | "bottom"
  ): TransformStyle => {
    switch (direction) {
      case "left":
        return {
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -size / 1],
              }),
            },
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -size / 1.5],
              }),
            },
            { scale: buttonScale },
          ],
        };
      case "right":
        return {
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, size / 1],
              }),
            },
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -size / 1.5],
              }),
            },
            { scale: buttonScale },
          ],
        };
      case "top":
        return {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -size / 0.8],
              }),
            },
            { scale: buttonScale },
          ],
        };
      case "bottom":
        return {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, size / 1.5],
              }),
            },
            { scale: buttonScale },
          ],
        };
      default:
        return { transform: [{ translateX: new Animated.Value(0) }] };
    }
  };

  return (
    <StyledView
      className={
        component
          ? "justify-center items-center self-center z-99"
          : "justify-center items-center absolute bottom-6 self-center z-99"
      }
    >
      <AnimatedHamburgerButton active={isActive} onPress={handlePress} />
      {["left", "right", "top"].map((direction: any) => (
        <StyledAnimatedView
          key={direction}
          className="absolute w-14 h-14 rounded-full bg-[#048998] justify-center items-center z-99"
          style={[
            directionalTransform(direction),
            {
              opacity: animation,
            },
          ]}
        >
          <StyledTouchableOpacity
            onPress={() =>
              navigation.navigate("CustomButton", {
                screen:
                  direction === "left"
                    ? "Activity"
                    : direction === "right"
                    ? "Meals"
                    : "Health",
              })
            }
          >
            {direction === "left" ? (
              <Icon name="dumbbell" size={18} color="white" />
            ) : direction === "right" ? (
              <Icon name="utensils" size={18} color="white" />
            ) : (
              <IconFontAwesome.default
                name="heartbeat"
                size={18}
                color="white"
              />
            )}
          </StyledTouchableOpacity>
        </StyledAnimatedView>
      ))}
    </StyledView>
  );
};

export default CustomAddButton;
