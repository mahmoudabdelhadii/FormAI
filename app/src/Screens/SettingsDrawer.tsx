import React from "react";
import { View, Text, Button } from "react-native";
import { styled } from "nativewind";
import { useDispatch } from "react-redux";
import { clearUser } from "../state-managment/slices/userSlice";
import { clearToken } from "../state-managment/slices/tokenSlice";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(Button);

const SettingsDrawer: React.FC = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearToken());
    // Optionally navigate to the login screen or perform other actions
  };

  return (
    <StyledView className="flex-1 justify-center items-center bg-background">
      <StyledText className="text-2xl font-bold text-primary-dark">
        Settings
      </StyledText>
      <StyledButton
        title="Close"
        color="#035c66"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <StyledButton title="Logout" color="#660303" onPress={handleLogout} />
    </StyledView>
  );
};

export default SettingsDrawer;
