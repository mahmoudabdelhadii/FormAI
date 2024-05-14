import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppScreens from "./AppScreens";
import AuthScreens from "./AuthScreens";

export default function Home() {
  return (
    <NavigationContainer>
      <AppScreens />
    </NavigationContainer>
  );
}
