import React from "react";
import { View, FlatList, StyleSheet, SafeAreaView } from "react-native";
import MessageItem from "../components/MessageItem";

const dummyData = [
  {
    id: "1",
    name: "Community 1",
    photoUrl: "https://example.com/community1.jpg",
    lastMessage: "Hello from Community 1",
  },
  {
    id: "2",
    name: "User 1",
    photoUrl: "https://example.com/user1.jpg",
    lastMessage: "Hey there!",
  },
  {
    id: "3",
    name: "Community 2",
    photoUrl: "https://example.com/community2.jpg",
    lastMessage: "Welcome to Community 2",
  },
  // Add more dummy data as needed
];

const MessagingScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <MessageItem
      name={item.name}
      photoUrl={item.photoUrl}
      lastMessage={item.lastMessage}
      onPress={() => navigation.navigate("Chat", { name: item.name })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default MessagingScreen;
