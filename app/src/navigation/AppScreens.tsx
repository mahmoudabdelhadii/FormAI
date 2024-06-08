import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MediaScreens from "./MediaScreens";
import MessagingTab from "../navigation/MesaagingTab";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import HomeCombinedScreen from "../navigation/HomeCombinedScreen";
import ProfileTab from "../Screens/ProfileTab";
import SearchTab from "../Screens/Search/SearchTab";
import MessagingScreen from "../Screens/Home/MessagingScreen";
import CameraScreen from "../Screens/Home/CameraScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeFeed from "../Screens/Home/HomeFeed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomAddButton from "../components/AddButton";
import { TouchableWithoutFeedback } from "react-native";
import MessagingIcon from "../components/Shared/HeaderMessagingIcon";
import LogoTitle from "../components/Shared/HeaderLogoTitle";
import CameraIcon from "../components/Shared/HeaderCameraIcon";
import CustomButtonScreens from "./CustomButtonScreens";
import { styled } from "nativewind";

const StyledView = styled(View);
const MainTab = createBottomTabNavigator();
function AppScreens() {
  return (
    <StyledView className="relative flex-1">
      <MainTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            if (route.name === "HomeCombinedScreen") iconName = "home";
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
            height: 90,
            paddingBottom: 30,
            display: route.name === "HomeCombinedScreen" ? "none" : "flex",
          },
          headerShown: false, // Show header only on HomeFeed
          // headerTitle: () => <LogoTitle />,
          // headerRight: () => <MessagingIcon />,
          // headerLeft: () => <CameraIcon />,
          // headerStyle: {
          //   backgroundColor: "#048998",
          //   shadowColor: "transparent",
          //   elevation: 0, // for Android
          //   borderBottomWidth: 0, // for iOS
          // },
          // headerTitleAlign: "center",
        })}
      >
        <MainTab.Screen
          name="HomeCombinedScreen"
          component={HomeCombinedScreen}
        />
        <MainTab.Screen name="Search" component={SearchTab} />
        <MainTab.Screen
          name="CustomButton"
          component={CustomButtonScreens} // Placeholder component
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Prevent the tab from being selected
              // Handle action here
            },
          }}
          options={{
            tabBarButton: (props) => (
              <TouchableWithoutFeedback
                {...props}
                onPress={() => console.log("Add Button Pressed!")}
              >
                <StyledView className="align-center bottom-0 z-99">
                  <CustomAddButton
                    color="#048998"
                    size={60}
                    onPress={() => console.log("...")}
                  />
                </StyledView>
              </TouchableWithoutFeedback>
            ),
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableWithoutFeedback
                onPress={() => console.log("Add Button Pressed!")}
              />
            ),
          }}
        />
        <MainTab.Screen name="Messages" component={MessagingScreen} />
        <MainTab.Screen name="Profile" component={ProfileTab} />
      </MainTab.Navigator>
    </StyledView>
  );
}

export default AppScreens;
