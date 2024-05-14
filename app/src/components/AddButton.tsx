import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import * as IconFontAwesome from "react-native-vector-icons/FontAwesome";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledAnimatedView = styled(Animated.View);

type TransformStyle = {
  transform: (
    | { translateX: Animated.AnimatedInterpolation<number> }
    | { translateY: Animated.AnimatedInterpolation<number> }
    | { scale: Animated.AnimatedInterpolation<number> }
  )[];
};
const CustomAddButton = ({ color = "#048998", size = 150, onPress }) => {
  const [isActive, setIsActive] = useState(false);
  const animation = new Animated.Value(0);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Returns true if t

  useEffect(() => {
    if (!isFocused && isActive) {
      // If the screen loses focus and the buttons are visible, close them
      toggleButtons(false);
    }
  }, [isFocused]);

  const handlePress = () => {
    toggleButtons(!isActive);
  };
  const handleOverlayPress = () => {
    toggleButtons(false); // Close the extra buttons when the overlay is pressed
  };
  const toggleButtons = (open) => {
    setIsActive(open);
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onPress?.(); // Call onPress if it exists
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive]);
  // const handlePress = () => {
  //   setIsActive(!isActive);
  //   onPress?.(); // Call onPress if it exists
  //   Animated.timing(animation, {
  //     toValue: isActive ? 0 : 1,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // };
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const directionalTransform = (
    direction: "left" | "right" | "top" | "bottom" | null
  ): TransformStyle => {
    switch (direction) {
      case "left":
        return {
          transform: [
            { translateX: Animated.multiply(animation, -size) },
            { translateY: Animated.multiply(animation, -size) },
          ],
        };
      case "right":
        return {
          transform: [
            { translateX: Animated.multiply(animation, size) },
            { translateY: Animated.multiply(animation, -size) },
          ],
        };
      case "top":
        return {
          transform: [
            { translateY: Animated.multiply(animation, -size * 1.5) },
          ],
        };
      case "bottom":
        return {
          transform: [{ translateY: Animated.multiply(animation, size) }],
        };
      default:
        return { transform: [{ translateX: new Animated.Value(0) }] }; // No-op transformation, consider providing a more meaningful default
    }
  };

  return (
    <StyledView className="justify-center items-center absolute bottom-6 self-center z-11">
      {isActive && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <StyledView className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-transparent" />
        </TouchableWithoutFeedback>
      )}
      <StyledTouchableOpacity onPress={handlePress}>
        <StyledAnimatedView
          className="justify-center items-center"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        >
          {isActive ? (
            <IconFontAwesome.default name="close" size={30} color="white" />
          ) : (
            <Icon name="dumbbell" size={30} color="white" />
          )}
        </StyledAnimatedView>
      </StyledTouchableOpacity>
      {isActive &&
        ["left", "right", "top"].map((direction, index) => (
          <StyledAnimatedView
            key={index}
            className="absolute w-17.5 h-17.5 rounded-full bg-[#048998] z-20"
            style={[
              {
                transform: [
                  ...directionalTransform(direction as any).transform,
                  { scale: buttonScale },
                ],
                opacity: animation,
              },
            ]}
          />
        ))}
    </StyledView>
  );
};

export default CustomAddButton;
