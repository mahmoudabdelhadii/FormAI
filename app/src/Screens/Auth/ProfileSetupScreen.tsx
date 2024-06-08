import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import ProgressBar from "react-native-progress/Bar";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);

const ProfileSetupScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [unit, setUnit] = useState("kg");
  const [progress, setProgress] = useState(0.33);
  const navigation = useNavigation();

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (!username || !bio) {
      Alert.alert("Please fill in all fields");
    } else {
      navigation.navigate("DetailsSetup", { unit });
    }
  };

  return (
    <StyledView className="flex-1 justify-between items-center px-10 bg-white">
      <StyledView className="w-full justify-center items-center self-center mt-10">
        <StyledText className="text-5xl mb-6 text-[#224957]">
          Profile Setup
        </StyledText>
        <ProgressBar progress={progress} width={200} color="#224957" />
      </StyledView>
      <StyledView className="w-full justify-center items-center">
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("../../assets/profile_placeholder.png")
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </StyledView>
      <StyledView className="w-full">
        <StyledTextInput
          className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg bg-[#224957] text-lg text-white"
          placeholder="Username"
          placeholderTextColor="#ffffff"
          value={username}
          onChangeText={setUsername}
        />
        <StyledTextInput
          className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg bg-[#224957] text-lg text-white"
          placeholder="Bio"
          placeholderTextColor="#ffffff"
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <StyledView className="w-full flex-row justify-around mt-6">
          <TouchableOpacity onPress={() => setUnit("kg")}>
            <StyledText
              className={`text-lg ${
                unit === "kg" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              KG
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUnit("lbs")}>
            <StyledText
              className={`text-lg ${
                unit === "lbs" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              LBS
            </StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledView>
      <StyledView className="w-full justify-center items-center mb-5">
        <StyledButton title="Next" onPress={handleNext} />
      </StyledView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});

export default ProfileSetupScreen;
