import React from 'react';
import { StyleSheet, Text,  Pressable, Animated} from 'react-native';


const SecondaryButton = props => {

  const expand = React.useRef(new Animated.Value(0)).current;

  const expand_Up = () => {
    Animated.spring(expand, {
      toValue: 5,
      useNativeDriver: true,
    }).start();
  };
  const expand_Down = () => {
    Animated.spring(expand, {
      toValue: -5,
      bounciness: 12,
      useNativeDriver: true,
    }).start();
  };

  const animate_button = () => {
    expand_Up;
    expand_Down;
  }


  return(
    <Animated.View 
    style={[styles.container, 
      {
        transform:[{translateY:expand}]
      }
    ]}
     >
      <Pressable 
        onPressIn={expand_Up}
        onPressOut={expand_Down}
        style={styles.button1} 
        onPress={ props.onPress}
        disabled={props.disabled}
        >
        <Text style={{  
          alignItems: 'center',
         
         fontSize:16, color: '#f6f5f5' 
         }}>{props.title}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    // backgroundColor: Colors.test2
  },
  button1: {
    paddingVertical: "5.4%",
    borderRadius: 35,
    backgroundColor: '#035c66',
    alignItems :'center',
    justifyContent : 'center',
    
  },

  button2: {
    paddingVertical: "5.4%",
    borderRadius: 35,
    backgroundColor: '#f6f5f5',
    borderColor:'#035c66',
    alignItems :'center',
    justifyContent : 'center',
    
  },
 
txt:{
    color: "#f6f5f5"
},
txt2:{
    color: "#035c66"
}


  
})

export default SecondaryButton;