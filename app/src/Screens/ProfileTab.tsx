import React from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";

const ProfileTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile Tab</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
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

export default ProfileTab;
