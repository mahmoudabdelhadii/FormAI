import React, { useState, useEffect } from "react";
import { SafeAreaView, View, FlatList, Text } from "react-native";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const ActivityScreen = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    // Replace with your actual API endpoint
    const response = await fetch("https://api.example.com/activities");
    const data = await response.json();
    setActivities(data);
  };

  const renderItem = ({ item }) => (
    <StyledView className="p-4 bg-white rounded-lg mb-2 shadow">
      <StyledText className="text-lg font-bold">{item.name}</StyledText>
      <StyledText className="text-gray-600">{item.description}</StyledText>
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1 p-4 bg-gray-100">
      <StyledText className="text-2xl font-bold mb-4">
        Activity Tracker
      </StyledText>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </StyledSafeAreaView>
  );
};

export default ActivityScreen;
