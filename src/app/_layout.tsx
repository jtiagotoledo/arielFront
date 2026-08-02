import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '@/database/init';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SQLiteProvider databaseName="arielDB.db" onInit={initDatabase}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="config" />
        </Stack>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});