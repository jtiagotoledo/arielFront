import { useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { initDatabase } from "@/database/init";

export default function App() {

  useEffect(() => {
    initDatabase();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Beba Água!</Text>
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
});