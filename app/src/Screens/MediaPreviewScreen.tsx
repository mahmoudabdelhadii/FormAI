import React, { useEffect } from "react";
import { View, Text, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { styled } from "nativewind";
import * as MediaLibrary from "expo-media-library";
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledVideo = styled(Video);

const MediaPreviewScreen: React.FC = () => {
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
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

  return (
    <StyledSafeAreaView className="flex-1 justify-center items-center bg-black">
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
          useNativeControls
          isLooping
        />
      )}
      <StyledView className="absolute top-10 left-10">
        <Button title="Close" onPress={() => navigation.goBack()} />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default MediaPreviewScreen;
