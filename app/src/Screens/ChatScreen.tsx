import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const ChatScreen = ({ route }) => {
  const { name } = route.params;

  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", sender: "other" },
    { id: "2", text: "Hi! How are you?", sender: "me" },
    { id: "3", text: "I am good, thanks!", sender: "other" },
    // Add more messages as needed
  ]);

  const [newMessage, setNewMessage] = useState("");

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{name}</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
