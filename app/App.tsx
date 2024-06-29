import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Home from "./src/navigation/navigation";
import { Provider } from "react-redux";
import store from "./src/state-managment/store";
import React, { useState } from "react";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import AppInitialization from "./src/components/AppInitilization";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function App() {
  const [isAppInit, setIsAppInit] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return (
      <StyledView className="flex-1 bg-white justify-center items-center">
        <StyledText>Loading Fonts...</StyledText>
      </StyledView>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      {isAppInit ? (
        <Home />
      ) : (
        <AppInitialization
          onInitializationComplete={() => setIsAppInit(true)}
        />
      )}
    </Provider>
  );
}
