import { createStackNavigator } from "@react-navigation/stack";
import HealthScreen from "../Screens/UtilityScreens/HealthScreen";
import ActivityScreen from "../Screens/UtilityScreens/ActivityScreen";
import MealScreen from "../Screens/UtilityScreens/MealsScreen";
const HealthStack = createStackNavigator();
function CustomButtonScreens() {
  return (
    <HealthStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthStack.Screen name="Health" component={HealthScreen} />
      <HealthStack.Screen name="Activity" component={ActivityScreen} />
      <HealthStack.Screen name="Meals" component={MealScreen} />
    </HealthStack.Navigator>
  );
}

export default CustomButtonScreens;
