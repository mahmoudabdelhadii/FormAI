import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/navigation/navigation";
import { Provider } from "react-redux";
import store from "./src/state-managment/store";
import { useState } from "react";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import AppInitialization from "./src/components/AppInitilization";
export default function App() {
  const [isAppInit, setIsAppInit] = useState<boolean>(false);

  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar style="auto" />

      {isAppInit ? (
        <Home />
      ) : (
        <AppInitialization
          onInitializationComplete={() => setIsAppInit(true)}
        />
      )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter_900Black",
  },
});
