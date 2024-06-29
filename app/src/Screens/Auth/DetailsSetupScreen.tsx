import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScalePicker from "../../components/Auth/ScalePicker"; // Adjust the path as necessary
import ProgressBar from "react-native-progress/Bar";

const AgePickerScreen: React.FC = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const navigation = useNavigation();

  const generateScaleData = (min: number, max: number) => {
    const data: number[] = [];
    for (let i = min; i <= max; i++) {
      data.push(i);
    }
    return data;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("MainApp"); // Assuming 'MainApp' is your next screen
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleInputChange = (value: string) => {
    const numericValue = parseInt(value);
    switch (currentStep) {
      case 1:
        setWeight(numericValue);
        break;
      case 2:
        setHeight(numericValue);
        break;
      case 3:
        setAge(numericValue);
        break;
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight.toString()}
              onChangeText={handleInputChange}
            />
            <ScalePicker
              data={generateScaleData(30, 150)}
              renderItem={(item) => (
                <View style={styles.scaleItem} key={item}>
                  <Text style={[styles.scaleText, styles.scaleTextLarge]}>
                    {item}
                  </Text>
                  <View style={styles.scaleLineLarge} />
                </View>
              )}
              itemWidth={40}
              initialIndex={generateScaleData(30, 150).indexOf(weight)}
              onChange={(index) => setWeight(generateScaleData(30, 150)[index])}
              mark={<Text style={styles.scaleMark}>▲</Text>}
              interpolateScale={(index, itemWidth) => ({
                inputRange: [
                  itemWidth * (index - 3),
                  itemWidth * (index - 2),
                  itemWidth * (index - 1),
                  itemWidth * index,
                  itemWidth * (index + 1),
                  itemWidth * (index + 2),
                  itemWidth * (index + 3),
                ],
                outputRange: [0.7, 0.7, 1.4, 2, 1.4, 0.7, 0.7],
              })}
              interpolateOpacity={(index, itemWidth) => ({
                inputRange: [
                  itemWidth * (index - 2),
                  itemWidth * (index - 1),
                  itemWidth * index,
                  itemWidth * (index + 1),
                  itemWidth * (index + 2),
                ],
                outputRange: [0.7, 0.9, 1, 0.9, 0.7],
              })}
              style={styles.picker}
            />
            <Text style={styles.value}>{weight} kg</Text>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={height.toString()}
              onChangeText={handleInputChange}
            />
            <ScalePicker
              data={generateScaleData(100, 250)}
              renderItem={(item) => (
                <View style={styles.scaleItem} key={item}>
                  <Text style={[styles.scaleText, styles.scaleTextLarge]}>
                    {item}
                  </Text>
                  <View style={styles.scaleLineLarge} />
                </View>
              )}
              itemWidth={30}
              initialIndex={generateScaleData(100, 250).indexOf(height)}
              onChange={(index) =>
                setHeight(generateScaleData(100, 250)[index])
              }
              mark={<Text style={styles.scaleMark}>▲</Text>}
              interpolateScale={(index, itemWidth) => ({
                inputRange: [
                  itemWidth * (index - 3),
                  itemWidth * (index - 2),
                  itemWidth * (index - 1),
                  itemWidth * index,
                  itemWidth * (index + 1),
                  itemWidth * (index + 2),
                  itemWidth * (index + 3),
                ],
                outputRange: [0.7, 0.7, 1.4, 2, 1.4, 0.7, 0.7],
              })}
              interpolateOpacity={(index, itemWidth) => ({
                inputRange: [
                  itemWidth * (index - 2),
                  itemWidth * (index - 1),
                  itemWidth * index,
                  itemWidth * (index + 1),
                  itemWidth * (index + 2),
                ],
                outputRange: [0.7, 0.9, 1, 0.9, 0.7],
              })}
              style={styles.picker}
            />
            <Text style={styles.value}>{height} cm</Text>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={age.toString()}
              onChangeText={handleInputChange}
            />
            <ScalePicker
              data={generateScaleData(10, 100)}
              renderItem={(item) => (
                <View style={styles.scaleItem} key={item}>
                  <Text
                    style={{
                      width: 40,
                      textAlign: "center",
                      height: 70,
                    }}
                  >
                    {item}
                  </Text>
                  <View style={styles.scaleLineLarge} />
                </View>
              )}
              itemWidth={30}
              initialIndex={generateScaleData(10, 100).indexOf(age)}
              onChange={(index) => setAge(generateScaleData(10, 100)[index])}
              mark={<Text style={styles.scaleMark}>▲</Text>}
              interpolateScale={(index, itemWidth) => ({
                inputRange: [
                  itemWidth * (index - 3),
                  itemWidth * (index - 2),
                  itemWidth * (index - 1),
                  itemWidth * index,
                  itemWidth * (index + 1),
                  itemWidth * (index + 2),
                  itemWidth * (index + 3),
                ],
                outputRange: [0.7, 0.7, 1.4, 2, 1.4, 0.7, 0.7],
              })}
              interpolateOpacity={(index, itemWidth) => ({
                inputRange: [
                  itemWidth * (index - 2),
                  itemWidth * (index - 1),
                  itemWidth * index,
                  itemWidth * (index + 1),
                  itemWidth * (index + 2),
                ],
                outputRange: [0.7, 0.9, 1, 0.9, 0.7],
              })}
              style={styles.picker}
            />
            <Text style={styles.value}>{age} years</Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Details Setup</Text>
        <ProgressBar
          progress={currentStep / totalSteps}
          width={200}
          color="#224957"
        />
      </View>
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.footer}>
        <Button title="Previous" onPress={handlePrevious} />
        <Button
          title={currentStep < totalSteps ? "Next" : "Finish"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 40,
    color: "#224957",
    marginBottom: 20,
  },
  content: {
    width: "100%",
  },
  label: {
    fontSize: 18,
    color: "#224957",
    marginBottom: 10,
    textAlign: "center",
  },
  value: {
    fontSize: 18,
    color: "#224957",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    height: 100,
    marginBottom: 20,
  },
  scaleItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  scaleText: {
    width: 20,
    textAlign: "center",
    color: "#224957",
  },
  scaleTextLarge: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scaleLine: {
    width: 1,
    height: 10,
    backgroundColor: "#224957",
    marginTop: 2,
  },
  scaleLineLarge: {
    height: 20,
  },
  scaleMark: {
    color: "black",
    fontWeight: "bold",
    paddingBottom: 30,
  },
  footer: {
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  input: {
    height: 40,
    borderColor: "#224957",
    borderWidth: 1,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#224957",
    width: "60%",
    alignSelf: "center",
  },
});

export default AgePickerScreen;
