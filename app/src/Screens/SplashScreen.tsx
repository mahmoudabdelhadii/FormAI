import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import LottieView from "lottie-react-native";

interface PreSplashProps {
  onAnimationComplete: () => void; // Callback when animation finishes
  isFetchingUser: Boolean;
}

const PreSplash: React.FC<PreSplashProps> = ({
  onAnimationComplete,
  isFetchingUser,
}) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/splash-pre.lottie.json")}
        autoPlay
        loop={false}
        style={{ width: "100%", height: "100%" }}
        onAnimationFinish={onAnimationComplete} // Triggering the callback
      />
      {isFetchingUser && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const PostSplash: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/splash-post.lottie.json")} // Loading final animation
        autoPlay
        loop={false}
        style={{ width: "100%", height: "100%" }}
        onAnimationFinish={() => {
          console.log("app init done");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#048998",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)", // Reduced opacity for clearer appearance
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 400, // Moves the ActivityIndicator downward
  },
});

export { PreSplash, PostSplash };
