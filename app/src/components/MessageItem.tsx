import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface MessageItemProps {
  name: string;
  photoUrl: string;
  lastMessage: string;
  onPress: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  name,
  photoUrl,
  lastMessage,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: photoUrl }} style={styles.photo} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
});

export default MessageItem;
