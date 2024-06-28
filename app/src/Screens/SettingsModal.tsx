import React from "react";
import { View, Text, Button, Dimensions } from "react-native";
import { styled } from "nativewind";
import { useDispatch } from "react-redux";
import { clearUser } from "../state-managment/slices/userSlice";
import { clearToken } from "../state-managment/slices/tokenSlice";
import Modal from "react-native-modal";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(Button);

const { width, height } = Dimensions.get("window");

const SettingsModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearToken());
    // Optionally navigate to the login screen or perform other actions
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <StyledView
        className="bg-white rounded-t-lg p-4"
        style={{ width: width, height: height / 2 }}
      >
        <StyledText className="text-2xl font-bold text-primary-dark mb-4">
          Settings
        </StyledText>
        <StyledButton title="Close" color="#035c66" onPress={onClose} />
        <View style={{ marginVertical: 10 }} />
        <StyledButton title="Logout" color="#660303" onPress={handleLogout} />
      </StyledView>
    </Modal>
  );
};

export default SettingsModal;
