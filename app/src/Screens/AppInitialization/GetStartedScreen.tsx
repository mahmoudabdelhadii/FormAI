import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/native";
import { styled } from "nativewind";
import { TouchableOpacity } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledButton = styled(Button);

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const slides = [
  {
    title: "Welcome to Our App!",
    lottiefile: require("../../assets/welcome1.json"),
    description: "Get started with our app!",
  },
  {
    title: "Discover New Features!",
    lottiefile: require("../../assets/welcome2.json"),
    description: "Get started with our app!",
  },
  {
    title: "Get Started Now!",
    lottiefile: require("../../assets/welcome7.json"),
    description: "Get started with our app!",
  },
  {
    title: "Start Exploring!",
    lottiefile: require("../../assets/welcome3.json"),
    description: "Get started with our app!",
  },
  {
    title: "Get Started Now!",
    lottiefile: require("../../assets/welcome4.json"),
    description: "Get started with our app!",
  },
  {
    title: "Start Exploring!",
    lottiefile: require("../../assets/welcome5.json"),
    description: "Get started with our app!",
  },
  {
    title: "Start Exploring!",
    lottiefile: require("../../assets/welcome6.json"),
    description: "Get started with our app!",
  },
];

const GetStartedScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <LottieView
        source={item.lottiefile}
        autoPlay
        loop={true}
        style={{ width: "100%", height: "100%" }}
      />
      <Text style={styles.text}>{item.title}</Text>
    </View>
  );

  const pagination = (
    <StyledView className="absolute bottom-28">
      <Pagination
        dotsLength={slides.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: "transparent",
          borderRadius: 60,
          width: viewportWidth * 0.5,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="bg-[#035c66]" style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={slides}
        layout="default"
        renderItem={renderItem}
        layoutCardOffset={18}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth * 0.9}
        containerCustomStyle={styles.carouselContainer}
        contentContainerCustomStyle={styles.carouselContainer}
        loop={false}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      {pagination}
      <View style={styles.buttonContainer}>
        <StyledButton
          title="Skip"
          onPress={() => navigation.navigate("Welcome")}
          color="grey"
        />
      </View>
    </StyledSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    height: viewportHeight * 0.8, // Make the carousel container the same height as the slides
  },
  slide: {
    width: viewportWidth * 0.9,
    height: viewportHeight * 0.7, // Ensure the slide height matches the container height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: viewportWidth * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GetStartedScreen;
