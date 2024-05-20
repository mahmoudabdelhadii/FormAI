import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { styled } from "nativewind";
import * as MediaLibrary from "expo-media-library";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledVideo = styled(Video);
const StyledTouchableOpacity = styled(TouchableOpacity);

const MediaPreviewScreen: React.FC = () => {
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  const [buttonsVisible, setButtonsVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!mediaLibraryPermission) {
      requestMediaLibraryPermission();
    }
  }, [mediaLibraryPermission]);

  type RouteParams = {
    uri: string;
    type: "photo" | "video";
  };

  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { uri, type } = route.params;

  const shareMedia = async () => {
    try {
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not share media.");
    }
  };

  const downloadMedia = async () => {
    if (mediaLibraryPermission?.granted) {
      try {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Success", "Media saved to library.");
      } catch (error) {
        Alert.alert("Error", "Could not save media.");
      }
    } else {
      requestMediaLibraryPermission();
    }
  };

  const handleLongPress = (event: { nativeEvent: { state: number } }) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      console.log("Long press active");
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setButtonsVisible(false));
    } else if (event.nativeEvent.state === State.END) {
      console.log("Long press end");
      setButtonsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <LongPressGestureHandler
        onHandlerStateChange={handleLongPress}
        minDurationMs={300}
      >
        <StyledView className="flex-1 justify-center items-center bg-black">
          {type === "photo" && (
            <StyledImage
              source={{ uri }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
          {type === "video" && (
            <StyledVideo
              source={{ uri }}
              className="w-full h-full"
              useNativeControls={false}
              isLooping
              shouldPlay
            />
          )}
          <Animated.View style={{ opacity: fadeAnim }}>
            <StyledView className="absolute top-0 left-0 bg-red w-full h-20">
              <StyledTouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="close-circle" size={40} color="white" />
              </StyledTouchableOpacity>
            </StyledView>
            <StyledView className="absolute top-10 right-10 flex-row space-x-4">
              <StyledTouchableOpacity onPress={shareMedia}>
                <Ionicons name="share-social" size={40} color="white" />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity onPress={downloadMedia}>
                <MaterialCommunityIcons
                  name="download"
                  size={40}
                  color="white"
                />
              </StyledTouchableOpacity>
            </StyledView>
            <StyledView className="absolute bottom-10 w-full flex-row justify-center space-x-4">
              <StyledTouchableOpacity
                className="bg-blue-500 rounded-full p-4"
                onPress={() =>
                  Alert.alert("Post", "Post functionality to be implemented.")
                }
              >
                <StyledText className="text-white">Post</StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="bg-red-500 rounded-full p-4"
                onPress={() => navigation.goBack()}
              >
                <StyledText className="text-white">Cancel</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </Animated.View>
        </StyledView>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );
};

export default MediaPreviewScreen;
