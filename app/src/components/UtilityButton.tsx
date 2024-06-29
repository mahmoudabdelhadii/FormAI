import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledButton = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.View);

const AnimatedHamburgerButton = ({ active, onPress }) => {
  const rotationTop = useSharedValue(0);
  const rotationMiddle = useSharedValue(0);
  const rotationBottom = useSharedValue(0);
  const topPosition = useSharedValue(35);
  const bottomPosition = useSharedValue(35);
  const leftPosition = useSharedValue(40); // Adjusted to match 'calc(50% + 10px)'

  const toggleActive = () => {
    onPress();
    if (!active) {
      rotationTop.value = withTiming(45);
      topPosition.value = withTiming(50);
      rotationMiddle.value = withTiming(-45);
      rotationBottom.value = withTiming(45);
      bottomPosition.value = withTiming(50);
      leftPosition.value = withTiming(35);
    } else {
      rotationTop.value = withTiming(0);
      topPosition.value = withTiming(35);
      rotationMiddle.value = withTiming(0);
      rotationBottom.value = withTiming(0);
      bottomPosition.value = withTiming(35);
      leftPosition.value = withTiming(40);
    }
  };

  const animatedStyleTop = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationTop.value}deg` }],
      top: `${topPosition.value}%`,
    };
  });

  const animatedStyleMiddle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationMiddle.value}deg` }],
    };
  });

  const animatedStyleBottom = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationBottom.value}deg` }],
      bottom: `${bottomPosition.value}%`,
      left: `${leftPosition.value}%`,
    };
  });

  return (
    <StyledButton
      onPress={toggleActive}
      className="relative h-20 w-20 rounded-full bg-[#048998] transition-colors justify-center items-center"
    >
      <StyledAnimatedView style={[animatedStyleTop, styles.topStyle]} />
      <StyledAnimatedView style={[animatedStyleMiddle, styles.middleStyle]} />
      <StyledAnimatedView style={[animatedStyleBottom, styles.bottomStyle]} />
    </StyledButton>
  );
};

const styles = StyleSheet.create({
  topStyle: {
    position: "absolute",
    height: 2,
    width: 40,
    backgroundColor: "white",
    left: "25%",
    transform: [{ translateX: -20 }], // 50% of 40px width
  },
  middleStyle: {
    position: "absolute",
    height: 2,
    width: 40,
    backgroundColor: "white",
    left: "25%",
    transform: [{ translateX: -20 }], // 50% of 40px width
  },
  bottomStyle: {
    position: "absolute",
    height: 2,
    width: 20,
    backgroundColor: "white",
    left: "40%",
    transform: [{ translateX: -10 }], // 50% of 20px width
  },
});

export default AnimatedHamburgerButton;
