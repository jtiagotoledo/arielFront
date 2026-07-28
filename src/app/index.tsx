import React from "react";
import {View, Text, StyleSheet} from 'react-native';

export default function App(){
  return(
    <View style={styles.container}>
      <Text style={styles.texto}>Texto central</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3995EE',
    justifyContent:'center',
    alignItems:'center',
  },
  texto:{
    color:'#ffffff',
  },
});