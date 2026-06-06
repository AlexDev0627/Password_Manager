import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';
import generatePassword from '@/utils/passwordGenerate';
import * as Clipboard from 'expo-clipboard';



export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  //random pass
  const [randomPass, setRandomPass] = useState("");

  const generate = () => {
    setRandomPass(generatePassword(12));
    console.log(randomPass)
  }

  ///funcion para copiar al portapaeles
  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    alert(`${label} copiado al portapapeles`)
    closeSheetPass();
  }
  //configuracion del bottomsheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '35%'], []);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  //BotttomSheet para generar una password
  const bottomSheetPass = useRef<BottomSheet>(null);
  const snapPointsPass = useMemo(() => ['25%', '45%'], []);

  const openSheetPass = useCallback(() => {
    bottomSheetPass.current?.expand();
    closeSheet();
    generate();

  }, []);

  const closeSheetPass = useCallback(() => {
    bottomSheetPass.current?.close();
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
    // Retardo sutil para que el Bottom Sheet se cierre de manera fluida antes de navegar
    setTimeout(() => {
      router.push(route as any);
      closeSheet();
    }, 100);
  };

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#5f78ca',
          tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingTop: 8,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarBackground: () => (
            <BlurView
              tint={isDark ? 'dark' : 'light'}
              intensity={65}
              style={StyleSheet.absoluteFill}
            />
          ),
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Feather size={24} name="shield" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="passwords"
          options={{
            title: 'Crear',
            tabBarIcon: ({ color }) => (
              <Feather size={24} name="plus-circle" color={color} />
            ),
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
            tabBarIcon: ({ color }) => (
              <Feather size={24} name="settings" color={color} />
            ),
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
              <Feather name="user" size={22} color="#5f78ca" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Inicio de Sesión (Login)</Text>
              <Text style={styles.optionDescription}>Guardar usuario, correo y contraseña de un sitio</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => openSheetPass()}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2e251b' : '#fef3c7' }]}>
              <Feather name="key" size={22} color="#d97706" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Nueva Contraseña</Text>
              <Text style={styles.optionDescription}>Generar y almacenar una contraseña segura</Text>
            </View>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetPass}
        index={-1}
        snapPoints={snapPointsPass}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Generar Contraseña</Text>

          <View style={styles.passwordContainer}>
            <View style={styles.passwordCard}>
              <Text style={styles.passwordText} numberOfLines={1} adjustsFontSizeToFit>
                {randomPass || "Generando..."}
              </Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={() => generate()}>
              <Feather name="refresh-cw" size={18} color={isDark ? "#60a5fa" : "#3b82f6"} />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            style={styles.copyButton}
            contentStyle={styles.copyButtonContent}
            labelStyle={styles.copyButtonLabel}
            icon="content-copy"
            onPress={() => copyToClipboard(randomPass || "", "Contraseña")}
          >
            Copiar Contraseña
          </Button>
        </BottomSheetView>
      </BottomSheet>

    </View >
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  passwordCard: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  copyButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  copyButtonContent: {
    height: 48,
  },
  copyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  }

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  passwordCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  copyButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  copyButtonContent: {
    height: 48,
  },
  copyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  }
});