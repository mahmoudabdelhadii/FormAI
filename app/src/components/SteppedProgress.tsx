import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const SteppedProgress = () => {
  const [stepsComplete, setStepsComplete] = useState(0);
  const numSteps = 4;

  const handleSetStep = (num: -1 | 1) => {
    if (
      (stepsComplete === 0 && num === -1) ||
      (stepsComplete === numSteps && num === 1)
    ) {
      return;
    }
    setStepsComplete((pv) => pv + num);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Steps numSteps={numSteps} stepsComplete={stepsComplete} />
        <View style={styles.contentPlaceholder} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSetStep(-1)}
          >
            <Text style={styles.buttonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => handleSetStep(1)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Steps = ({
  numSteps,
  stepsComplete,
}: {
  numSteps: number;
  stepsComplete: number;
}) => {
  const stepArray = Array.from(Array(numSteps).keys());

  return (
    <View style={styles.stepsContainer}>
      {stepArray.map((num) => {
        const stepNum = num + 1;
        const isActive = stepNum <= stepsComplete;
        return (
          <React.Fragment key={stepNum}>
            <Step num={stepNum} isActive={isActive} />
            {stepNum !== stepArray.length && (
              <View style={styles.stepConnector}>
                <Connector isActive={isActive} />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const Step = ({ num, isActive }: { num: number; isActive: boolean }) => {
  return (
    <View style={styles.stepContainer}>
      <View
        style={[
          styles.step,
          isActive ? styles.activeStep : styles.inactiveStep,
        ]}
      >
        <Text style={styles.stepText}>{num}</Text>
      </View>
      {isActive && <View style={styles.pulse} />}
    </View>
  );
};

const Connector = ({ isActive }: { isActive: boolean }) => {
  const progress = useSharedValue(isActive ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? "100%" : "0%", {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  return (
    <View style={styles.connectorContainer}>
      <Animated.View style={[styles.connector, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepContainer: {
    position: "relative",
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  activeStep: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
    borderWidth: 2,
  },
  inactiveStep: {
    backgroundColor: "white",
    borderColor: "#CBD5E0",
    borderWidth: 2,
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
  },
  pulse: {
    position: "absolute",
    top: -5,
    bottom: -5,
    left: -5,
    right: -5,
    backgroundColor: "#E0E7FF",
    borderRadius: 20,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: "#CBD5E0",
    position: "relative",
  },
  connectorContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#CBD5E0",
  },
  connector: {
    height: 2,
    backgroundColor: "#4F46E5",
  },
  contentPlaceholder: {
    height: 100,
    marginVertical: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: "#4F46E5",
  },
  buttonText: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SteppedProgress;
