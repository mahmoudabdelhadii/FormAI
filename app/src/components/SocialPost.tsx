import React, { useState, memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import DoubleTap from "./DoubleTap"; // Ensure this import is correct based on your project structure
import { styled } from "nativewind";

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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
    <StyledView className="bg-white border-b border-gray-300 pb-2.5">
      <StyledView className="flex-row items-center p-2.5">
        <StyledImage
          source={{ uri: post.userProfilePic }}
          className="w-10 h-10 rounded-full mr-2.5"
        />
        <StyledText className="font-bold">{post.username}</StyledText>
      </StyledView>
      <DoubleTap onDoubleTap={handleLike}>
        <StyledImage
          source={{ uri: post.imageUrl }}
          className="w-full h-75"
          resizeMode="cover"
        />
      </DoubleTap>
      <StyledView className="flex-row justify-start p-2.5">
        <StyledTouchableOpacity onPress={handleLike}>
          <Icon
            name={isLiked ? "heart" : "heart-outline"}
            type="material-community"
            color={isLiked ? "red" : "black"}
            size={24}
          />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity>
          <Icon name="comment-outline" type="material-community" size={24} />
        </StyledTouchableOpacity>
      </StyledView>
      <StyledText className="font-bold pl-2.5">{likes} Likes</StyledText>
      <StyledText className="pl-2.5 pt-1.25">
        {post.username}: {post.caption}
      </StyledText>
      <StyledTouchableOpacity>
        <StyledText className="pl-2.5 text-gray-500 pt-1.25">
          View all {post.commentsCount} comments
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
});

export default SocialPost;
