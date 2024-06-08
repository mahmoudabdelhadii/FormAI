import React, { useState, useEffect } from "react";
import {
  PreSplash,
  PostSplash,
} from "../Screens/AppInitialization/SplashScreen";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

interface AppInitializationProps {
  onInitializationComplete: () => void;
}

const AppInitialization: React.FC<AppInitializationProps> = ({
  onInitializationComplete,
}) => {
  const [currentStage, setCurrentStage] = useState("preSplash");
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  useEffect(() => {
    if (currentStage === "preSplash") {
      // Animation finishes, move to loading state

      // setCurrentStage("loading"); // Transition to loading stage
      // setIsFetchingUser(true);
      // Simulate fetching user data
      setTimeout(() => {
        setIsFetchingUser(false);
        setCurrentStage("postSplash"); // Transition to PostSplash after fetching is done
      }, 100); // Simulate fetching delay
    }
  }, [currentStage]);

  useEffect(() => {
    if (currentStage === "postSplash") {
      setTimeout(() => {
        onInitializationComplete(); // Proceed to the main app
      }, 100); // Brief display of PostSplash before transitioning
    }
  }, [currentStage, onInitializationComplete]);

  return (
    <>
      {(currentStage === "preSplash" || currentStage === "loading") && (
        <PreSplash
          onAnimationComplete={() => {
            setCurrentStage("loading");
            setIsFetchingUser(true);
          }}
          isFetchingUser={isFetchingUser}
        />
      )}

      {currentStage === "postSplash" && <PostSplash />}
    </>
  );
};

export default AppInitialization;
