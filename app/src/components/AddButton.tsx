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
import { BlurView } from "expo-blur";
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
};

const CustomAddButton: React.FC<CustomAddButtonProps> = ({
  color = "#048998",
  size = 150,
  onPress,
}) => {
  const [isActive, setIsActive] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const handlePress = () => {
    toggleButtons(!isActive);
  };

  const toggleButtons = (open: boolean) => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsActive(open));

    onPress?.();
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

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
                outputRange: [0, -size / 2],
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
                outputRange: [0, -size / 2],
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
    <StyledView className="justify-center items-center absolute bottom-6 self-center z-11">
      <StyledTouchableWithoutFeedback onPress={handlePress}>
        <StyledAnimatedView
          className="justify-center items-center"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        >
          <StyledAnimatedView
            style={{
              position: "absolute",
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <MaterialCommunityIcons.default
              name="weight-lifter"
              size={30}
              color="white"
            />
          </StyledAnimatedView>
          <StyledAnimatedView
            style={{
              position: "absolute",
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }}
          >
            <IconFontAwesome.default name="close" size={30} color="white" />
          </StyledAnimatedView>
        </StyledAnimatedView>
      </StyledTouchableWithoutFeedback>
      {["left", "right", "top"].map((direction: any) => (
        <StyledAnimatedView
          key={direction}
          className="absolute w-14 h-14 rounded-full bg-[#048998] justify-center items-center"
          style={[
            directionalTransform(direction),
            {
              opacity: animation,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              console.log(
                `${
                  direction.charAt(0).toUpperCase() + direction.slice(1)
                } Pressed`
              )
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
          </TouchableOpacity>
        </StyledAnimatedView>
      ))}
    </StyledView>
  );
};

export default CustomAddButton;
