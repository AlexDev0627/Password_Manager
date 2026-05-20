import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '@/context/ThemeContext';
import React, { useRef, useMemo, useCallback } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  //configuracion del bottomsheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '35%'], []);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  ), []);

  const handleOptionPress = (route: string) => {
    closeSheet();
    // Retardo sutil para que el Bottom Sheet se cierre de manera fluida antes de navegar
    setTimeout(() => {
      router.push(route as any);
    }, 250);
  };

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? '#2e499aff' : 'gray',
          tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
          tabBarStyle: {
            backgroundColor: isDark ? '#181a20' : '#f0f0f0',
            borderTopColor: isDark ? '#333' : '#ccc',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="lock" color={color} />,
          }}
        />

        <Tabs.Screen
          name="passwords"
          options={{
            title: 'Crear',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              // Evita que navegue a la pantalla 'passwords' directamente al presionar el tab
              e.preventDefault();
              openSheet();
            },
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

      {/* modal bottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Qué deseas crear?</Text>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleOptionPress('/passwords')}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1e293b' : '#eef2ff' }]}>
              <FontAwesome5 name="user-shield" size={20} color="#5f78ca" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Inicio de Sesión (Login)</Text>
              <Text style={styles.optionDescription}>Guardar usuario, correo y contraseña de un sitio</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleOptionPress('')}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2e251b' : '#fef3c7' }]}>
              <FontAwesome5 name="key" size={20} color="#d97706" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Nueva Contraseña</Text>
              <Text style={styles.optionDescription}>Generar y almacenar una contraseña segura</Text>
            </View>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  bottomSheetBg: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: '#cbd5e1',
    width: 40,
    height: 4,
  },
  modalContent: {
    padding: 24,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});

const darkStyles = StyleSheet.create({
  bottomSheetBg: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#1c1f26',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: '#475569',
    width: 40,
    height: 4,
  },
  modalContent: {
    padding: 24,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252932',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2e333d',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  optionDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});