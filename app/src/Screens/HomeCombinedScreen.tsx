import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeFeed from "./HomeFeed";
import CameraScreen from "./CameraScreen";
import MessagingTab from "./MesaagingTab";

const Tab = createMaterialTopTabNavigator();

function HomeCombinedScreen() {
  return (
    <Tab.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        tabBarStyle: { height: 0, display: "none" }, // Set the height to 0 to hide the tab bar
        swipeEnabled: true, // Enable swiping between screens
        tabBarIndicatorStyle: { top: 0 }, // Hide indicator
        tabBarShowLabel: false, // Show or hide labels
      }}
    >
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="HomeFeed" component={HomeFeed} />
      <Tab.Screen name="MessagesScreen" component={MessagingTab} />
    </Tab.Navigator>
  );
}

export default HomeCombinedScreen;
