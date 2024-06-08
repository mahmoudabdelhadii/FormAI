import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeFeed from "../Screens/Home/HomeFeed";
import MediaScreens from "./MediaScreens";
import MessagingTab from "./MesaagingTab";

const Tab = createMaterialTopTabNavigator();

function HomeCombinedScreen() {
  return (
    <Tab.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        tabBarStyle: { height: 0, display: "none" },
        swipeEnabled: true,
        tabBarIndicatorStyle: { top: 0 },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Media" component={MediaScreens} />
      <Tab.Screen name="HomeFeed" component={HomeFeed} />
      <Tab.Screen name="MessagesTab" component={MessagingTab} />
    </Tab.Navigator>
  );
}

export default HomeCombinedScreen;
