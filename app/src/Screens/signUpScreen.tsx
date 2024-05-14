import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setLoading } from "../state-managment/reducers/loadingReducer";
import { setUser } from "../state-managment/reducers/userReducer";
import { useDispatch } from "react-redux";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (password !== rePassword) {
      Alert.alert("Password Do not match, please try again");
    } else {
      dispatch(setLoading(true));
    }
  };

  return (
    <StyledView className="flex-1 justify-between items-center px-10 bg-white">
      <StyledView className="w-full justify-center items-center self-center mt-10">
        <StyledText className="text-5xl mb-6 text-[#224957]">SignUp</StyledText>
      </StyledView>
      <StyledView className="w-full">
        <StyledTextInput
          className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg bg-[#224957] text-lg text-white"
          placeholder="Name"
          placeholderTextColor="#ffffff"
          value={name}
          onChangeText={setName}
        />
        <StyledTextInput
          className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg bg-[#224957] text-lg text-white"
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
        />
        <StyledTextInput
          className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg bg-[#224957] text-lg text-white"
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <StyledTextInput
          className="w-full border border-gray-300 px-4 py-3 mb-4 rounded-lg bg-[#224957] text-lg text-white"
          placeholder="Retype Password"
          placeholderTextColor="#ffffff"
          secureTextEntry
          value={rePassword}
          onChangeText={setRePassword}
        />
      </StyledView>
      <StyledView className="w-full justify-center items-center mb-5">
        <StyledButton title="SignUp" onPress={handleSignUp} />
      </StyledView>
    </StyledView>
  );
};

export default SignUpScreen;
