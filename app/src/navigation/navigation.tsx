import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/FontAwesome";

import LoginScreen from "../Screens/SignInScreen";
import SignUpScreen from "../Screens/signUpScreen";
import WelcomeScreen from "../Screens/WelcomeScreen";
import { TouchableOpacity } from "react-native";

import MessagingTab from "../Screens/MesaagingTab";
import SearchTab from "../Screens/SearchTab";
import HomeCombinedScreen from "../Screens/HomeCombinedScreen";
import ProfileTab from "../Screens/ProfileTab";
import CustomAddButton from "../components/AddButton";
import PrimaryButton from "../components/PrimaryButton";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function AppScreens() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
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
      <Tab.Screen name="Home" component={HomeCombinedScreen} />
      <Tab.Screen name="Search" component={SearchTab} />
      <Tab.Screen
        name="Add"
        component={PrimaryButton} // Make sure PrimaryButton is correctly defined or adjust as needed
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // This will prevent the tab from being selected
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
            <TouchableOpacity
              {...props}
              activeOpacity={0.7}
              onPress={() => console.log("Add Pressed")}
            />
          ),
        }}
      />
      <Tab.Screen name="Messages" component={MessagingTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
}

export default function Home() {
  return (
    <NavigationContainer>
      <AppScreens />
    </NavigationContainer>
  );
}
