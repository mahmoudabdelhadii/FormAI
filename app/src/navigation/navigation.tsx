import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthScreens from "./AuthScreens";
import AppScreens from "./AppScreens";
import store from "../state-managment/store";
import useAuth from "../Hooks/useAuth";
import {
  PreSplash,
  PostSplash,
} from "../Screens/AppInitialization/SplashScreen";

const HomeContent = () => {
  const { accessToken, status, isCheckingAuth } = useAuth();
  const [preSplashDone, setPreSplashDone] = useState(false);
  const [postSplashDone, setPostSplashDone] = useState(false);

  if (isCheckingAuth) {
    return (
      <PreSplash
        onAnimationComplete={() => setPreSplashDone(true)}
        isFetchingUser={true}
      />
    );
  }

  if (!preSplashDone) {
    return (
      <PreSplash
        onAnimationComplete={() => setPreSplashDone(true)}
        isFetchingUser={false}
      />
    );
  }

  if (preSplashDone && !postSplashDone) {
    return <PostSplash onAnimationComplete={() => setPostSplashDone(true)} />;
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
