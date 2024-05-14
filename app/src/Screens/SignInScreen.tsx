import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { setLoading } from "../state-managment/reducers/loadingReducer";
import { setUser } from "../state-managment/reducers/userReducer";

const SignInScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignIn = () => {
    // Dispatch setLoading action with true to show the loading screen
    dispatch(setLoading(true));
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.SignInLabel}>SignIn</Text>
      </View>

      <View style={{ width: "100%" }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#ffffff"}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#ffffff"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.container2}>
        <Button title="SignIn" onPress={handleSignIn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
    backgroundColor: "#ffffff",
  },
  container1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: "20%",
    bottom: "10%",
  },
  container2: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    top: "6%",
  },
  SignInLabel: {
    fontSize: 50,
    color: "#224957",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#224957",
    fontSize: 18,

    color: "#ffffff",
  },
  forgotPassword: {
    marginTop: 16,
    color: "#555",
    textDecorationLine: "underline",
  },
  Button: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignInScreen;
