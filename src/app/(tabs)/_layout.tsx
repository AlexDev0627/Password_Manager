import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: isDark ? '#2e499aff' : 'gray',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarStyle: {
          backgroundColor: isDark ? '#181a20' : '#f0f0f0',
          borderTopColor: isDark ? '#333' : '#ccc',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Inicio',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="list"
        options={{
          headerShown: false,
          title: 'Lista',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="sticky-note" color={color} />,
        }}
      />
      <Tabs.Screen
        name="passwords"
        options={{
          headerShown: false,
          title: 'Contraseñas',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="lock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Configuración',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
