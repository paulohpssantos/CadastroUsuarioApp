import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { initDb } from '@/src/db/drizzle';

import { useColorScheme } from '@/hooks/use-color-scheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initDb();
      } catch (err) {
        console.error('Erro ao iniciar a base de dados:', err);
      } finally {
        if (mounted) setDbReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  
  if (!dbReady) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
