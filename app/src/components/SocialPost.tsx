import React, { useState, memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import DoubleTap from "./DoubleTap"; // Ensure this import is correct based on your project structure

interface Post {
  id: string;
  userProfilePic: string;
  username: string;
  imageUrl: string;
  likesCount: number;
  caption: string;
  commentsCount: number;
}

interface SocialPostProps {
  post: Post;
}

const SocialPost: React.FC<SocialPostProps> = memo(({ post }) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.userProfilePic }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{post.username}</Text>
      </View>
      <DoubleTap onDoubleTap={handleLike}>
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      </DoubleTap>
      <View style={styles.interactionBar}>
        <TouchableOpacity onPress={handleLike}>
          <Icon
            name={isLiked ? "heart" : "heart-outline"}
            type="material-community"
            color={isLiked ? "red" : "black"}
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="comment-outline" type="material-community" size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.likes}>{likes} Likes</Text>
      <Text style={styles.caption}>
        {post.username}: {post.caption}
      </Text>
      <TouchableOpacity>
        <Text style={styles.comments}>
          View all {post.commentsCount} comments
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
  },
  likes: {
    fontWeight: "bold",
    paddingLeft: 10,
  },
  caption: {
    paddingLeft: 10,
    paddingTop: 5,
  },
  comments: {
    paddingLeft: 10,
    color: "gray",
    paddingTop: 5,
  },
});

export default SocialPost;
