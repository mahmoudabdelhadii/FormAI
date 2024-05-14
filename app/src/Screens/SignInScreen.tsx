import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setLoading } from "../state-managment/reducers/loadingReducer";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignIn = () => {
    dispatch(setLoading(true));
  };

  return (
    <StyledView className="flex-1 justify-center items-center px-10 bg-white">
      <StyledView className="w-full justify-center items-center self-center mb-20 mt-10">
        <StyledText className="text-5xl text-[#224957]">SignIn</StyledText>
      </StyledView>
      <StyledView className="w-full">
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
      </StyledView>
      <StyledView className="w-full justify-center items-center mt-6">
        <StyledButton title="SignIn" onPress={handleSignIn} />
      </StyledView>
    </StyledView>
  );
};

export default SignInScreen;
