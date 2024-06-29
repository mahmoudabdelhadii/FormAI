import React, { useCallback } from "react";
import { TouchableWithoutFeedback } from "react-native";

const DoubleTap = ({ children, onDoubleTap }) => {
  let lastTap = null;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      onDoubleTap();
    }
    lastTap = now;
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DoubleTap;
