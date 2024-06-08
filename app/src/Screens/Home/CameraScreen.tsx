import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  PanResponder,
} from "react-native";
import {
  CameraType,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
  PermissionStatus,
  CameraView,
} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { styled } from "nativewind";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MediaStackParamList } from "../../navigation/MediaScreens";

type CameraScreenNavigationProp = StackNavigationProp<
  MediaStackParamList,
  "Camera"
>;

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const CameraScreen: React.FC = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");

  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const videoRecordPromise = cameraRef.current.recordAsync();
        const data = await videoRecordPromise;
        const source = data?.uri;
        if (source) {
          navigation.navigate("MediaPreview", {
            uri: source,
            type: "video",
          });
        } else {
        }
      } catch (error) {
        console.error("Error recording video:", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraReady && cameraRef.current && isRecording) {
      try {
        cameraRef.current.stopRecording();
      } catch (error) {
        console.error("Error stopping recording:", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRecording();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 100) {
          // User swiped right
          console.log("User swiped right while recording");
        }
      },
      onPanResponderRelease: () => {
        stopRecording();
      },
    })
  ).current;

  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (cameraPermission.status !== PermissionStatus.GRANTED) {
    return (
      <StyledSafeAreaView className="flex-1 justify-center items-center bg-white">
        <StyledText className="text-center">
          We need your permission to show the camera
        </StyledText>
        <Button
          onPress={requestCameraPermission}
          title="Grant camera permission"
        />
      </StyledSafeAreaView>
    );
  }

  if (microphonePermission.status !== PermissionStatus.GRANTED) {
    return (
      <StyledSafeAreaView className="flex-1 justify-center items-center bg-white">
        <StyledText className="text-center">
          We need your permission to record audio
        </StyledText>
        <Button
          onPress={requestMicrophonePermission}
          title="Grant microphone permission"
        />
      </StyledSafeAreaView>
    );
  }

  const takePhoto = async () => {
    if (cameraReady && cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        navigation.navigate("MediaPreview", {
          uri: photo.uri,
          type: "photo",
        });
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      switch (current) {
        case "off":
          return "on";
        case "on":
          return "auto";
        case "auto":
          return "off";
        default:
          return "off";
      }
    });
  };

  const getFlashIcon = (flashMode: FlashMode) => {
    switch (flashMode) {
      case "off":
        return "flash-off";
      case "on":
        return "flash";
      case "auto":
        return "flash-auto";
      default:
        return "flash-off";
    }
  };

  const handleDoubleTap = () => {
    toggleCameraFacing();
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
        onCameraReady={() => setCameraReady(true)}
        mode="video"
      />
      <GestureHandlerRootView className="absolute top-0 bottom-0 left-0 right-0 py-8">
        <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
          <StyledSafeAreaView className="flex-1">
            <StyledSafeAreaView className="absolute top-0 w-full flex-row justify-between px-4 py-2">
              <StyledTouchableOpacity
                onPress={toggleFlash}
                className="bg-gray-700 p-3 rounded-full"
                disabled={!cameraReady}
              >
                <MaterialCommunityIcons
                  name={getFlashIcon(flash)}
                  size={30}
                  color="white"
                />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={toggleCameraFacing}
                className="bg-gray-700 p-3 rounded-full"
                disabled={!cameraReady}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={30}
                  color="white"
                />
              </StyledTouchableOpacity>
            </StyledSafeAreaView>
            <StyledView
              className="absolute bottom-10 w-full flex-row justify-center"
              {...panResponder.panHandlers}
            >
              <StyledTouchableOpacity
                onPress={takePhoto}
                onLongPress={startRecording}
                onPressOut={stopRecording}
                className="bg-red-500 rounded-full"
                style={{
                  width: 70,
                  height: 70,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={!cameraReady}
              >
                {isRecording ? (
                  <Ionicons name="square-outline" size={40} color="white" />
                ) : (
                  <Ionicons name="camera-outline" size={40} color="white" />
                )}
              </StyledTouchableOpacity>
            </StyledView>
          </StyledSafeAreaView>
        </TapGestureHandler>
      </GestureHandlerRootView>
    </StyledSafeAreaView>
  );
};

export default CameraScreen;
