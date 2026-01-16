import { DarkTheme, DefaultTheme, ThemeProvider as TP } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'index',
};

import { ThemeProvider } from './context/ThemeContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TP value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TP >
  );
}
