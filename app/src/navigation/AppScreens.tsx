import React, { useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/FontAwesome";
import HomeCombinedScreen from "./HomeCombinedScreen";
import SearchTab from "../Screens/SearchTab";

import ProfileTab from "../Screens/ProfileTab";
import CustomAddButton from "../components/AddButton";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import MessagingScreen from "../Screens/MessagingScreen";

const MainTab = createBottomTabNavigator();

function AppScreens() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "Add") iconName = "plus";
          else if (route.name === "Messages") iconName = "envelope";
          else if (route.name === "Profile") iconName = "user";

          const iconSize = focused ? size + 6 : size;
          const iconOpacity = focused ? 1 : 0.6;

          return (
            <Icon
              name={iconName}
              size={iconSize}
              color={color}
              style={{ opacity: iconOpacity }}
            />
          );
        },
        tabBarActiveTintColor: "#048998",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "transparent",
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
      <MainTab.Screen name="Home" component={HomeCombinedScreen} />
      <MainTab.Screen name="Search" component={SearchTab} />
      <MainTab.Screen
        name="Add"
        component={TouchableWithoutFeedback} // Placeholder component
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent the tab from being selected
            // Handle action here
          },
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <CustomAddButton
              color="#048998"
              size={focused ? 70 : 60}
              onPress={() => console.log("Add Button Pressed!")}
            />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              {...props}
              // activeOpacity={0.7}
              onPress={() => console.log("Add Pressed")}
            />
          ),
        }}
      />
      <MainTab.Screen name="Messages" component={MessagingScreen} />
      <MainTab.Screen name="Profile" component={ProfileTab} />
    </MainTab.Navigator>
  );
}

export default AppScreens;
