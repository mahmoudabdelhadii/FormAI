import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import SearchResultItem from "../components/SearchResultItem";
const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("accounts"); // 'accounts' or 'communities'
  const [results, setResults] = useState([]);
  const inputRef = useRef(null); // Add this line
  const fetchData = async () => {
    // Replace this with your actual data fetching logic
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
      inputRef.current.blur(); // Unfocus the text input
    }
    setIsFocused(false); // Optionally control focus state
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, isFocused && styles.searchInputActive]}
          placeholder={`Search ${selectedTab}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused && (
          <TouchableOpacity
            onPress={handleClearInput}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "accounts" && styles.selectedTab]}
          onPress={() => setSelectedTab("accounts")}
        >
          <Text style={styles.tabText}>Accounts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "communities" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("communities")}
        >
          <Text style={styles.tabText}>Communities</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
  },
  searchInputActive: {
    marginRight: 10, // adjust spacing for the cancel button
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF", // iOS-style blue
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedTab: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
  },
  resultsList: {
    marginTop: 10,
  },
});

export default SearchTab;
