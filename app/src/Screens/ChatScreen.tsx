import React, { useState } from "react";
import { View, Text, FlatList, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

interface ChatScreenProps {
  route: {
    params: {
      name: string;
    };
  };
}

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledFlatList = styled(FlatList);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { name } = route.params;

  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", sender: "other" },
    { id: "2", text: "Hi! How are you?", sender: "me" },
    { id: "3", text: "I am good, thanks!", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const renderItem = ({ item }) => (
    <StyledView
      className={`p-2.5 my-1.25 mx-2.5 rounded-lg ${
        item.sender === "me"
          ? "bg-[#DCF8C6] self-end"
          : "bg-[#ECECEC] self-start"
      }`}
    >
      <StyledText className="text-base">{item.text}</StyledText>
    </StyledView>
  );

  const sendMessage = () => {
    if (newMessage.trim().length > 0) {
      setMessages([
        ...messages,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: newMessage,
          sender: "me",
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledText className="text-xl font-bold p-2.5 text-center">
        {name}
      </StyledText>
      <StyledFlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />
      <StyledView className="flex-row p-2.5 border-t border-gray-300">
        <StyledTextInput
          className="flex-1 border border-gray-300 rounded-lg px-2.5 mr-2.5"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <StyledButton title="Send" onPress={sendMessage} />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default ChatScreen;
