import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../Screens/Auth/signUpScreen";
import ProfileSetupScreen from "../Screens/Auth/ProfileSetupScreen";
import DetailsSetupScreen from "../Screens/Auth/DetailsSetupScreen";
import MainAppScreen from "./AppScreens"; // Replace with your main app screen

const Stack = createStackNavigator();

const SignUpScreens: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="DetailsSetup" component={DetailsSetupScreen} />
      <Stack.Screen name="MainApp" component={MainAppScreen} />
    </Stack.Navigator>
  );
};

export default SignUpScreens;
