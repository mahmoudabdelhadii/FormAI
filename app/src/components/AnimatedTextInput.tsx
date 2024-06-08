import { useRef, useState, useEffect } from "react";
import {
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
} from "react-native";
import { styled } from "nativewind";
import Icon from "react-native-vector-icons/Ionicons";

interface AnimatedTextInputProps extends TextInputProps {
  placeholder: string;
  containerStyle?: any;
  error?: string;
}

const AnimatedTextInput: React.FC<AnimatedTextInputProps> = ({
  containerStyle,
  placeholder,
  onChangeText,
  error,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(props.value || "");
  const [showPassword, setShowPassword] = useState(secureTextEntry);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;

  useEffect(() => {
    if (props.value !== undefined) {
      setText(props.value);
    }
  }, [props.value]);

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!text) {
      animatedLabel(0);
    }
  };

  const handleTextChange = (inputText: string) => {
    setText(inputText);
    if (onChangeText) {
      onChangeText(inputText);
    }
    if (inputText) {
      animatedLabel(1);
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  };

  const animatedLabel = (toValue: number) => {
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [17, 0],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ["gray", "#888"],
    }),
  };

  return (
    <StyledView style={containerStyle} className="w-full">
      <StyledView
        className={`border rounded-lg h-12 justify-center ${
          error ? "border-red-500" : "border-gray-200"
        } bg-white`}
      >
        <Animated.Text style={[labelStyle]} className="absolute text-gray">
          {placeholder}
        </Animated.Text>
        <StyledView className="flex-row items-center h-full pr-2">
          <TextInput
            {...props}
            style={{ flex: 1 }}
            className="text-base flex justify-start items-center h-full pl-2 text-black"
            selectionColor={"white"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            value={text}
            textAlignVertical="center"
            textContentType={secureTextEntry ? "newPassword" : "none"}
            autoComplete={secureTextEntry ? "new-password" : "off"}
            secureTextEntry={showPassword}
          />
          {secureTextEntry && !!text && (
            <StyledView className="w-6">
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {!showPassword ? (
                  <Icon name="eye-outline" color={"gray"} size={24} />
                ) : (
                  <Icon name="eye-off-outline" color={"gray"} size={24} />
                )}
              </TouchableOpacity>
            </StyledView>
          )}
        </StyledView>
      </StyledView>
      {error && (
        <StyledText className="mt-1 text-sm text-red-500">{error}</StyledText>
      )}
    </StyledView>
  );
};

const StyledView = styled(View);
const StyledText = styled(Text);

export default AnimatedTextInput;
