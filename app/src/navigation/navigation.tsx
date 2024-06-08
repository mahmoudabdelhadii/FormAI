import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthScreens from "./AuthScreens";
import AppScreens from "./AppScreens";
import HomeCombinedScreen from "./HomeCombinedScreen";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "../state-managment/store";
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Here you would have logic to check if the user is authenticated
    // For example, checking a token in async storage or making an API call
    const checkAuth = async () => {
      // Replace with your actual authentication check logic
      const userIsAuthenticated = false; // Replace with actual check
      setIsAuthenticated(userIsAuthenticated);
    };

    checkAuth();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {isAuthenticated ? <AppScreens /> : <AuthScreens />}
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}
