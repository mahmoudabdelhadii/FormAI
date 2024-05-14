import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { setLoading } from "../state-managment/reducers/loadingReducer";
import { setUser } from "../state-managment/reducers/userReducer";
import { useDispatch } from "react-redux";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (password != RePassword) {
      Alert.alert("Password Do not match, please try again");
    } else {
      dispatch(setLoading(true));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.SignUpLabel}>SignUp</Text>
      </View>

      <View style={{ width: "100%" }}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={"#ffffff"}
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Retype Password"
          placeholderTextColor={"#ffffff"}
          secureTextEntry
          value={RePassword}
          onChangeText={setRePassword}
        />
      </View>

      <View style={styles.container2}>
        <Button title="SignUp" onPress={handleSignUp} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "10%",
    backgroundColor: "#ffffff",
  },
  container1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: "10%",
    // backgroundColor: "red",
  },
  container2: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    bottom: "5%",
  },
  SignUpLabel: {
    fontSize: 50,
    marginBottom: 24,

    color: "#224957",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",

    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 12,
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

export default SignUpScreen;
