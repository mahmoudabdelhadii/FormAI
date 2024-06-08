import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { styled } from "nativewind";

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

const AnimatedButton = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <StyledButton
        style={styles.button}
        onPressIn={() => (scale.value = withSpring(0.9))}
        onPressOut={() => (scale.value = withSpring(1))}
      >
        <StyledText style={styles.buttonText}>Press Me</StyledText>
      </StyledButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AnimatedButton;
