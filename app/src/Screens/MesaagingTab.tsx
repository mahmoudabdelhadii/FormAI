import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MessagingScreen from "./MessagingScreen";
import ChatScreen from "./ChatScreen"; // This would be your detailed chat screen

const Stack = createStackNavigator();

const MessagingTab = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default MessagingTab;
