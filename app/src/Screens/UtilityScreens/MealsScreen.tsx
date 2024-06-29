import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { styled } from "nativewind";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

const proteinOptions = [
  { name: "Chicken", ingredient: "chicken_breast" },
  { name: "Beef", ingredient: "beef" },
  { name: "Pork", ingredient: "pork" },
];

const MealScreen = () => {
  const [meals, setMeals] = useState([]);
  const [selectedProtein, setSelectedProtein] = useState(
    proteinOptions[0].ingredient
  );

  useEffect(() => {
    fetchMeals(selectedProtein);
  }, [selectedProtein]);

  const fetchMeals = async (protein) => {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${protein}`
    );
    const data = await response.json();
    setMeals(data.meals);
  };

  const renderItem = ({ item }) => (
    <StyledView className="p-4 bg-white rounded-lg mb-2 shadow">
      <StyledText className="text-lg font-bold">{item.strMeal}</StyledText>
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1 p-4 bg-gray-100">
      <StyledText className="text-2xl font-bold mb-4">Meal Options</StyledText>
      <StyledView className="flex-row mb-4">
        {proteinOptions.map((option) => (
          <StyledButton
            key={option.ingredient}
            className={`px-4 py-2 rounded-lg mr-2 ${
              selectedProtein === option.ingredient
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
            onPress={() => setSelectedProtein(option.ingredient)}
          >
            <StyledText className="text-white">{option.name}</StyledText>
          </StyledButton>
        ))}
      </StyledView>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal.toString()}
        renderItem={renderItem}
      />
    </StyledSafeAreaView>
  );
};

export default MealScreen;
