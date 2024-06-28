import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthScreens from "./AuthScreens";
import AppScreens from "./AppScreens";
import store from "../state-managment/store";
import useAuth from "../Hooks/useAuth";
import { PreSplash } from "../Screens/AppInitialization/SplashScreen";

const HomeContent = () => {
  const { accessToken, status, isCheckingAuth } = useAuth();
  const [preSplashDone, setPreSplashDone] = useState(false);

  useEffect(() => {
    if (!isCheckingAuth && preSplashDone) {
      // If checking auth is done and preSplash is done, you can navigate to the next screen
    }
  }, [isCheckingAuth, preSplashDone]);

  if (!preSplashDone) {
    return (
      <PreSplash
        onAnimationComplete={() => {
          setPreSplashDone(true);
        }}
        isFetchingUser={false}
      />
    );
  }

  if (isCheckingAuth) {
    return <PreSplash isFetchingUser={true} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {accessToken && status === "succeeded" ? (
          <AppScreens />
        ) : (
          <AuthScreens />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default function Home() {
  return (
    <Provider store={store}>
      <HomeContent />
    </Provider>
  );
}
