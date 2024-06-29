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
import { styled } from "nativewind";
import Icon from "react-native-vector-icons/FontAwesome6";
import AnimatedTextInput from "../../components/AnimatedTextInput";
import LoadAndErrorButton from "../../components/LoadAndWaitButton";
import { userLogin } from "../../thunks/userThunks";
import { passwordSchema } from "../../schemas/userSchema";
import { AppDispatch } from "../../state-managment/store";

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [variant, setVariant] = useState<
    "neutral" | "loading" | "error" | "success"
  >("neutral");

  // Perform login logic here
  const handleLogin = async () => {
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error.issues[0].message);
      return;
    }

    setPasswordError("");
    setVariant("loading");
    const result = await dispatch(userLogin(email, password));
    if (result.success) {
      setVariant("success");
    } else {
      setVariant("error");
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-background">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <StyledScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <StyledView className="flex-1 flex flex-col justify-end items-center px-5 text-zinc-900">
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

                <StyledView className="w-full">
                  <AnimatedTextInput
                    containerStyle={{ marginHorizontal: 2, marginTop: 2 }}
                    placeholder={"Email"}
                    onChangeText={setEmail}
                  />
                  <AnimatedTextInput
                    containerStyle={{ marginHorizontal: 2, marginTop: 5 }}
                    placeholder={"Password"}
                    onChangeText={setPassword}
                    error={passwordError}
                    secureTextEntry
                  />
                  <StyledTouchableOpacity
                    onPress={() =>
                      navigation.navigate("ForgotPassword" as never)
                    }
                    className="flex justify-end items-end"
                  >
                    <StyledText className="text-md text-foreground ">
                      Forgot Password?
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    className="w-25 rounded-md bg-dodgerblue items-center mt-5"
                    onPress={handleLogin}
                  >
                    <LoadAndErrorButton
                      initialText="Login"
                      variant={variant}
                      setVariant={setVariant}
                      onClick={handleLogin}
                    />
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>

              <StyledView className="w-full flex flex-col justify-center items-center mt-56">
                <StyledView className="w-[90vw] h-0.5 bg-border mb-3" />
                <StyledView className="w-full justify-center items-center">
                  <StyledTouchableOpacity
                    onPress={() => navigation.navigate("SignUp" as never)}
                    className="flex flex-row justify-center items-center gap-2"
                  >
                    <StyledText className="text-lg text-copy">
                      Don't have an account?
                    </StyledText>
                    <StyledText className="text-lg text-secondary">
                      Sign up here
                    </StyledText>
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

export default LoginScreen;
