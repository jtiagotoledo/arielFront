import { useEffect } from "react";
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { initDatabase } from "@/database/init";

export default function App() {

  useEffect(() => {
    initDatabase();
  }, [])

  const adicionarIngestao = () => {
    console.log('água adicionada!');

  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Beba Água!</Text>
      <TouchableHighlight
        style={styles.botao}
        onPress={adicionarIngestao}
        underlayColor='#ffffff'
      >
        <Text>Add</Text>
      </TouchableHighlight>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3995EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    color: '#ffffff',
  },
  botao: {
    backgroundColor: '#ffffff',
  }
});