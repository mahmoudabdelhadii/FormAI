
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

const PrimaryButton = (text, accent="Primary") => {


    return(
        <Button style={accent==="Primary"?styles.btn: styles.btn2}>
            <Text style={accent==="Primary"?styles.txt:styles.txt2}>{text} </Text>
            </Button>
    )
};

const styles = StyleSheet.create({
    btn: {
        width:"80%",

      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: "10%",
      backgroundColor: '#035c66',
      borderRadius:"50%"
    },
    btn2: {
        width:"80%",

      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: "10%",
      backgroundColor: '#f6f5f5',
      borderColor:'#035c66',
      borderRadius:"50%"
    },
    txt:{
        color: "#f6f5f5"
    },
    txt2:{
        color: "#035c66"
    }

  });

  export default PrimaryButton;