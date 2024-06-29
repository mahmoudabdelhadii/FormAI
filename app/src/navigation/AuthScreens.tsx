import LoginScreen from "../Screens/Auth/LogInScreen";
import SignUpScreen from "../Screens/Auth/signUpScreen";
import WelcomeScreen from "../Screens/AppInitialization/WelcomeScreen";
import SignUpScreens from "./SignupScreens";
import ProfileSetupScreen from "../Screens/Auth/ProfileSetupScreen";
import DetailsSetupScreen from "../Screens/Auth/DetailsSetupScreen";
import AppScreens from "./AppScreens";
import GetStartedScreen from "../Screens/AppInitialization/GetStartedScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AuthStack = createStackNavigator();
function AuthScreens() {
  return (
    <AuthStack.Navigator
      initialRouteName="GetStarted"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="GetStarted" component={GetStartedScreen} />
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="LogIn" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <AuthStack.Screen name="DetailsSetup" component={DetailsSetupScreen} />
      <AuthStack.Screen name="MainApp" component={AppScreens} />
    </AuthStack.Navigator>
  );
}

export default AuthScreens;
