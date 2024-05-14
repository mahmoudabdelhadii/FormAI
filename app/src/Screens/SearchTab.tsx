import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import SearchResultItem from "../components/SearchResultItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledFlatList = styled(FlatList);

const SearchTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("accounts"); // 'accounts' or 'communities'
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const fetchData = async () => {
    setResults(
      selectedTab === "accounts"
        ? [
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
          ]
        : [
            { id: 1, name: "Community One" },
            { id: 2, name: "Community Two" },
          ]
    );
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const handleClearInput = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsFocused(false);
  };

  return (
    <StyledSafeAreaView className="flex-1 p-2.5">
      <StyledView className="flex-row items-center">
        <StyledTextInput
          ref={inputRef}
          className={`flex-1 h-10 border border-gray-400 rounded-lg px-2.5 ${
            isFocused ? "mr-2.5" : ""
          }`}
          placeholder={`Search ${selectedTab}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused && (
          <StyledTouchableOpacity onPress={handleClearInput} className="p-2.5">
            <StyledText className="text-lg text-[#007AFF]">Cancel</StyledText>
          </StyledTouchableOpacity>
        )}
      </StyledView>
      <StyledView className="flex-row mt-2.5">
        <StyledTouchableOpacity
          className={`flex-1 py-2.5 items-center border-b-2 ${
            selectedTab === "accounts" ? "border-black" : "border-transparent"
          }`}
          onPress={() => setSelectedTab("accounts")}
        >
          <StyledText className="text-lg">Accounts</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          className={`flex-1 py-2.5 items-center border-b-2 ${
            selectedTab === "communities"
              ? "border-black"
              : "border-transparent"
          }`}
          onPress={() => setSelectedTab("communities")}
        >
          <StyledText className="text-lg">Communities</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      <StyledFlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        className="mt-2.5"
      />
    </StyledSafeAreaView>
  );
};

export default SearchTab;
