import React, { useState, useEffect } from "react";
import { PreSplash } from "../Screens/AppInitialization/SplashScreen";

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
        onInitializationComplete(); // Proceed to the main app
      }, 100); // Simulate fetching delay
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
    </>
  );
};

export default AppInitialization;
