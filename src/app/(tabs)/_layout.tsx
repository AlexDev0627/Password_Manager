import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'gray' }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Inicio',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
     
      <Tabs.Screen
        name="notes"
        options={{
          headerShown: false,
          title: 'Notas',
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
