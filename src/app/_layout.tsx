import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
        }}
        />
    </Stack>
    </SafeAreaView>
  </ThemeProvider>
  );
}