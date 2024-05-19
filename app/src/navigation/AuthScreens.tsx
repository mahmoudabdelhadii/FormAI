import LoginScreen from "../Screens/SignInScreen";
import SignUpScreen from "../Screens/signUpScreen";
import WelcomeScreen from "../Screens/WelcomeScreen";
import { createStackNavigator } from "@react-navigation/stack";

const AuthStack = createStackNavigator();
function AuthScreens() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

export default AuthScreens;
