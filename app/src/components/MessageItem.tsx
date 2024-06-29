import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
interface MessageItemProps {
  name: string;
  photoUrl: string;
  lastMessage: string;
  onPress: () => void;
}
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const MessageItem: React.FC<MessageItemProps> = ({
  name,
  photoUrl,
  lastMessage,
  onPress,
}) => {
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      className="flex-row p-2.5 border-b border-gray-300"
    >
      <StyledImage
        source={{ uri: photoUrl }}
        className="w-12.5 h-12.5 rounded-full"
      />
      <StyledView className="ml-2.5 justify-center">
        <StyledText className="text-lg font-bold">{name}</StyledText>
        <StyledText className="text-sm text-gray-600">{lastMessage}</StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default MessageItem;
