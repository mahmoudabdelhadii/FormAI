import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledFlatList = styled(FlatList);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledTouchableWithoutFeedback = styled(TouchableWithoutFeedback);

type MessageItem = {
  id: string;
  sender: string;
  text: string;
};

const messagesArray: MessageItem[] = [
  { id: "1", text: "Hello!", sender: "other" },
  { id: "2", text: "Hi! How are you?", sender: "me" },
  { id: "3", text: "I am good, thanks!", sender: "other" },
];

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>(messagesArray);
  const [newMessage, setNewMessage] = useState("");

  const renderItem = ({ item }: { item: MessageItem }) => (
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
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: newMessage,
          sender: "me",
        },
      ]);
      setNewMessage("");
      Keyboard.dismiss(); // Dismiss the keyboard after sending a message
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1"
      >
        <StyledTouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <StyledView className="flex-1">
            <StyledFlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              initialNumToRender={10}
              maxToRenderPerBatch={10}
            />
            <StyledView className="flex-row p-2.5 border-t border-gray-300">
              <StyledTextInput
                className="flex-1 border border-gray-300 rounded-lg px-2.5 mr-2.5"
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message"
                onSubmitEditing={sendMessage} // Send message when the "Enter" key is pressed
              />
              <StyledButton title="Send" onPress={sendMessage} />
            </StyledView>
          </StyledView>
        </StyledTouchableWithoutFeedback>
      </StyledKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default ChatScreen;
