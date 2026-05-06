import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#2e499aff' : 'gray',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarStyle: {
          backgroundColor: isDark ? '#181a20' : '#f0f0f0',
          borderTopColor: isDark ? '#333' : '#ccc',
        },
        headerShown: false, // oculta el header en todas las pantallas por defecto
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="lock" color={color} />,
        }}
      />

      {/* <Tabs.Screen
        name="list"
        options={{
          title: 'Lista',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="sticky-note" color={color} />,
        }}
      /> */}

      <Tabs.Screen
        name="passwords"
        options={{
          title: 'Crear',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}