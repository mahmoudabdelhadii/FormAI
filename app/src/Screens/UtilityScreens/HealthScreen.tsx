import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import AppleHealthKit from "react-native-health";

const healthKitOptions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
      AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
    ],
  },
};

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const HealthScreen = () => {
  const [healthMetrics, setHealthMetrics] = useState({
    weight: null,
    heartRate: null,
    bloodPressureSystolic: null,
    bloodPressureDiastolic: null,
  });

  return (
    <StyledSafeAreaView className="flex-1 p-4 bg-gray-100">
      <StyledText className="text-2xl font-bold mb-4">
        Health Metrics
      </StyledText>
      <StyledView className="p-4 bg-white rounded-lg shadow">
        <StyledText className="text-lg font-bold">Overall Health</StyledText>
        <StyledText className="text-gray-600">
          Weight: {healthMetrics.weight} kg
        </StyledText>
        <StyledText className="text-gray-600">
          Heart Rate: {healthMetrics.heartRate} bpm
        </StyledText>
        <StyledText className="text-gray-600">
          Blood Pressure: {healthMetrics.bloodPressureSystolic}/
          {healthMetrics.bloodPressureDiastolic} mmHg
        </StyledText>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default HealthScreen;
