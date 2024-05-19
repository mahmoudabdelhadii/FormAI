import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../Screens/CameraScreen";
import MediaPreviewScreen from "../Screens/MediaPreviewScreen";

export type MediaStackParamList = {
  Camera: undefined;
  MediaPreview: { uri: string; type: "photo" | "video" };
};

const MediaStack = createStackNavigator<MediaStackParamList>();

const MediaScreens = () => {
  return (
    <MediaStack.Navigator screenOptions={{ headerShown: false }}>
      <MediaStack.Screen name="Camera" component={CameraScreen} />
      <MediaStack.Screen name="MediaPreview" component={MediaPreviewScreen} />
    </MediaStack.Navigator>
  );
};

export default MediaScreens;
