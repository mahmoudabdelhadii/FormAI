import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

interface SearchResultItemProps {
  item: {
    name: string;
  };
}

const StyledView = styled(View);
const StyledText = styled(Text);

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
  return (
    <StyledView className="p-2.5 border-b border-gray-300">
      <StyledText className="text-lg">{item.name}</StyledText>
    </StyledView>
  );
};

export default SearchResultItem;
