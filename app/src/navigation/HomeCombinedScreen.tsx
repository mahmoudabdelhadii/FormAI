import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeFeed from "../Screens/HomeFeed";
import CameraScreen from "../Screens/CameraScreen";
import MessagingTab from "../navigation/MesaagingTab";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Button, Image } from "react-native";
import MediaScreens from "./MediaScreens";

const Tab = createMaterialTopTabNavigator();

function HomeCombinedScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

    if (routeName === "HomeFeed") {
      navigation.setOptions({
        headerShown: true,
        headerRight: () => (
          <Button
            onPress={() => console.log("MessagingScreen")}
            title="Messages"
            color="#000"
          />
        ),
        headerTitle: () => (
          <Image
            source={{ uri: "https://example.com/logo.png" }} // Replace with your logo URL
            style={{ width: 40, height: 40 }}
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, route]);

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
