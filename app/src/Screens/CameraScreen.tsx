import React, { useState } from "react";
import { View, Text, Button, Image, Alert } from "react-native";
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  Asset,
} from "react-native-image-picker";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledButton = styled(Button);

const CameraScreen: React.FC = () => {
  const [photo, setPhoto] = useState<Asset | null>(null);

  const handleTakePhoto = () => {
    const options: CameraOptions = {
      mediaType: "photo",
      cameraType: "back",
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleChoosePhoto = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleUpload = () => {
    // Implement the upload logic here
    Alert.alert("Photo Uploaded", "Your photo has been uploaded successfully.");
    setPhoto(null);
  };

  const handleCancel = () => {
    setPhoto(null);
  };

  return (
    <StyledView className="flex-1 justify-center items-center">
      <StyledText className="text-2xl mb-5">Take a Photo</StyledText>
      {!photo ? (
        <StyledView className="flex-row justify-around w-4/5">
          <StyledButton title="Take Photo" onPress={handleTakePhoto} />
          <StyledButton
            title="Choose from Gallery"
            onPress={handleChoosePhoto}
          />
        </StyledView>
      ) : (
        <StyledView className="items-center">
          <StyledImage source={{ uri: photo.uri }} className="w-75 h-75 mb-5" />
          <StyledView className="flex-row justify-around w-4/5">
            <StyledButton title="Upload" onPress={handleUpload} />
            <StyledButton title="Cancel" onPress={handleCancel} />
          </StyledView>
        </StyledView>
      )}
    </StyledView>
  );
};

export default CameraScreen;
