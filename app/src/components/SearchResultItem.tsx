import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SearchResultItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
  },
});

export default SearchResultItem;
