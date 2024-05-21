import React, { useState } from "react";
import { View, FlatList, TextInput } from "react-native";
import MessageItem from "../components/MessageItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledFlatList = styled(FlatList);
const StyledTextInput = styled(TextInput);

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
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = dummyData.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(dummyData);
    }
  };

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
      <View className="p-4">
        <StyledTextInput
          className="border p-2 rounded"
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <StyledFlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </StyledSafeAreaView>
  );
};

export default MessagingScreen;
