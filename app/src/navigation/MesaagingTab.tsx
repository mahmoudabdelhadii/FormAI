import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MessagingScreen from "../Screens/MessagingScreen";
import ChatScreen from "../Screens/ChatScreen"; // This would be your detailed chat screen

const MessagingStack = createStackNavigator();

const MessagingTab = () => {
  return (
    <MessagingStack.Navigator screenOptions={{ headerShown: false }}>
      <MessagingStack.Screen name="Messages" component={MessagingScreen} />
      <MessagingStack.Screen name="Chat" component={ChatScreen} />
    </MessagingStack.Navigator>
  );
};

export default MessagingTab;
