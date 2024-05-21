import { createStackNavigator } from "@react-navigation/stack";
import HealthScreen from "../Screens/HealthScreen";
import ActivityScreen from "../Screens/ActivityScreen";
import MealScreen from "../Screens/MealsScreen";
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
