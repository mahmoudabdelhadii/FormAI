import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthScreens from "./AuthScreens";
import AppScreens from "./AppScreens";
import HomeCombinedScreen from "./HomeCombinedScreen";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Here you would have logic to check if the user is authenticated
    // For example, checking a token in async storage or making an API call
    const checkAuth = async () => {
      // Replace with your actual authentication check logic
      const userIsAuthenticated = true; // Replace with actual check
      setIsAuthenticated(userIsAuthenticated);
    };

    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
}
