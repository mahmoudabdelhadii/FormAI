import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styled } from "nativewind";
import CustomAddButton from "../components/AddButton";

const StyledView = styled(View);

const Footer = ({ navigation }) => {
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <StyledView className="flex flex-row justify-around items-center bg-black border-t-transparent h-[90px] pb-[30px]">
      <StyledView className="flex-1 items-center">
        <Icon
          name="home"
          size={25 + 6}
          color="#048998"
          onPress={() => navigateTo("HomeFeed")}
        />
      </StyledView>
      <StyledView className="flex-1 items-center">
        <Icon
          name="search"
          size={25}
          color="gray"
          onPress={() => navigateTo("Search")}
          style={{ opacity: 0.6 }}
        />
      </StyledView>
      <StyledView className="flex-1 items-center pb-12 align-bottom">
        <CustomAddButton
          color="#048998"
          size={60}
          onPress={() => console.log("Add Button Pressed!")}
          component
        />
      </StyledView>
      <StyledView className="flex-1 items-center">
        <Icon
          name="envelope"
          size={25}
          color="gray"
          onPress={() => navigateTo("Messages")}
          style={{ opacity: 0.6 }}
        />
      </StyledView>
      <StyledView className="flex-1 items-center">
        <Icon
          name="user"
          size={25}
          color="gray"
          onPress={() => navigateTo("Profile")}
          style={{ opacity: 0.6 }}
        />
      </StyledView>
    </StyledView>
  );
};

export default Footer;
