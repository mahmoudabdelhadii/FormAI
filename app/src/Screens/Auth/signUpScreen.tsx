import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setLoading } from "../../state-managment/slices/loadingSlice";
import { styled } from "nativewind";
import Icon from "react-native-vector-icons/FontAwesome6";
import AnimatedTextInput from "../../components/AnimatedTextInput";
import LoadAndErrorButton from "../../components/LoadAndWaitButton";

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [variant, setVariant] = useState<
    "neutral" | "loading" | "error" | "success"
  >("neutral");

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    dispatch(setLoading(true));
    // Perform sign-up logic here
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <StyledScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <StyledView className="flex-1 flex flex-col justify-center items-center px-5 text-zinc-900">
              <StyledTouchableOpacity
                className="absolute left-4 top-6 text-sm flex items-center gap-2 pl-8"
                onPress={() => navigation.goBack()}
              >
                <Icon
                  name="arrow-left"
                  size={30}
                  color={"#200234"}
                  className="text-zinc-50"
                />
              </StyledTouchableOpacity>
              <StyledView className="flex flex-col justify-center items-center w-full">
                <StyledView className="flex flex-col justify-center items-center gap-5 mb-5">
                  <StyledImage
                    style={{ width: 80, height: 80, resizeMode: "contain" }}
                    source={require("../../assets/flexing-Logo-dark.png")}
                    className="text-xl text-zinc-200"
                  />
                  <StyledImage
                    style={{ width: 350, height: 60, resizeMode: "contain" }}
                    source={require("../../assets/logoText-dark.png")}
                    className="text-xl text-zinc-200"
                  />
                </StyledView>

                <StyledView className="w-full px-2 flex flex-col items-center justify-center">
                  <AnimatedTextInput
                    containerStyle={{ marginVertical: 5 }}
                    placeholder={"Username"}
                    onChangeText={setUsername}
                  />
                  <StyledView className="w-full flex flex-row mt-2">
                    <AnimatedTextInput
                      containerStyle={{ flex: 1 }}
                      placeholder={"First Name"}
                      onChangeText={setFirstName}
                    />
                    <AnimatedTextInput
                      containerStyle={{ flex: 1 }}
                      placeholder={"Last Name"}
                      onChangeText={setLastName}
                    />
                  </StyledView>
                  <AnimatedTextInput
                    containerStyle={{ marginVertical: 5 }}
                    placeholder={"Email"}
                    onChangeText={setEmail}
                  />
                  <AnimatedTextInput
                    containerStyle={{ marginVertical: 5 }}
                    placeholder={"Password"}
                    onChangeText={setPassword}
                    error={passwordError}
                    secureTextEntry
                  />
                  <AnimatedTextInput
                    containerStyle={{ marginVertical: 5 }}
                    placeholder={"Confirm Password"}
                    onChangeText={setConfirmPassword}
                    error={confirmPasswordError}
                    secureTextEntry
                  />
                  <StyledTouchableOpacity
                    className="w-full rounded-md bg-dodgerblue items-center mt-5"
                    onPress={() => {
                      if (password.length < 6) {
                        setPasswordError("The password is too short");
                      } else {
                        setPasswordError("");
                      }

                      if (password !== confirmPassword) {
                        setConfirmPasswordError("Passwords do not match");
                      } else {
                        setConfirmPasswordError("");
                      }

                      if (
                        password.length >= 6 &&
                        password === confirmPassword
                      ) {
                        handleSignUp();
                      }
                    }}
                  >
                    <LoadAndErrorButton
                      initialText="Sign Up"
                      variant={variant}
                      setVariant={setVariant}
                      onClick={handleSignUp}
                    />
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledScrollView>
        </TouchableWithoutFeedback>
      </StyledKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default SignUpScreen;
