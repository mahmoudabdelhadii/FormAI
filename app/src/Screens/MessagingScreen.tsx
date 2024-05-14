import React from "react";
import { View, FlatList } from "react-native";
import MessageItem from "../components/MessageItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledFlatList = styled(FlatList);

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
];

const MessagingScreen: React.FC = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <MessageItem
      name={item.name}
      photoUrl={item.photoUrl}
      lastMessage={item.lastMessage}
      onPress={() => navigation.navigate("Chat", { name: item.name })}
    />
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledFlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </StyledSafeAreaView>
  );
};

export default MessagingScreen;
