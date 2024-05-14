import LoginScreen from "../Screens/SignInScreen";
import SignUpScreen from "../Screens/signUpScreen";
import WelcomeScreen from "../Screens/WelcomeScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
function AuthScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

export default AuthScreens;
