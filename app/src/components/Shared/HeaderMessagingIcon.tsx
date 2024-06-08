import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const MessagingIcon = () => {
  const navigation = useNavigation();

  return (
    <StyledTouchableOpacity
      onPress={() => navigation.navigate("MessagesTab")}
      className="pr-4"
    >
      <Icon name="message-circle" size={30} color="white" />
    </StyledTouchableOpacity>
  );
};

export default MessagingIcon;
