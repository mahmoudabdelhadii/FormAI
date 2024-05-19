import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileTab from "../Screens/ProfileTab";
import SettingsDrawer from "../Screens/SettingsDrawer";

const Drawer = createDrawerNavigator();

const ProfileSettingsDrawer: React.FC = () => {
  return (
    <Drawer.Navigator screenOptions={{ drawerPosition: "right" }}>
      <Drawer.Screen name="Profile" component={ProfileTab} />
      <Drawer.Screen name="Settings" component={SettingsDrawer} />
    </Drawer.Navigator>
  );
};

export default ProfileSettingsDrawer;
