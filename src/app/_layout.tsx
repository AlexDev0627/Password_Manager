import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}