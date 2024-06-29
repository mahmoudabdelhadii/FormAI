import React from "react";
import { View, Text, Image } from "react-native";
import { styled } from "nativewind";

interface SearchResultItemProps {
  item: {
    name: string;
    userProfilePic: string;
  };
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
  return (
    <StyledView className="flex-row items-center p-2.5">
      <StyledImage
        source={{ uri: item.userProfilePic }}
        className="w-10 h-10 rounded-full mr-2.5"
      />
      <StyledText className="font-bold">{item.name}</StyledText>
    </StyledView>
  );
};

export default React.memo(SearchResultItem);
