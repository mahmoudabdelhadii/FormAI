import React from "react";
import { View, StyleSheet, Image, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./signUpScreen";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <View style={styles.container1}>
          <SecondaryButton
            onPress={() => navigation.navigate("SignInScreen")}
            title={"Login"}
          />
        </View>
        <View style={styles.container1}>
          <SecondaryButton
            onPress={() => navigation.navigate("SignUpScreen")}
            title={"signUp"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  container1: {
    width: "100%",
    paddingTop: "5%",
    paddingHorizontal: "10%",
  },
  image: {
    width: "90%",
    height: "40%",
  },
});

export default WelcomeScreen;
