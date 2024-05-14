import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  Asset,
} from "react-native-image-picker";

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
    <View style={styles.container}>
      <Text style={styles.title}>Take a Photo</Text>
      {!photo ? (
        <View style={styles.buttonContainer}>
          <Button title="Take Photo" onPress={handleTakePhoto} />
          <Button title="Choose from Gallery" onPress={handleChoosePhoto} />
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          <View style={styles.buttonContainer}>
            <Button title="Upload" onPress={handleUpload} />
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  previewContainer: {
    alignItems: "center",
  },
  photo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});

export default CameraScreen;
