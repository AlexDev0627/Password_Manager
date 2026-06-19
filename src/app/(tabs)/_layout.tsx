import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '@/context/ThemeContext';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';
import  generatePassword  from '@/utils/passwordGenerate';
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

  const openSheetPass = useCallback(()=> {
    bottomSheetPass.current?.expand();
    closeSheet();
    generate();

  },[]);
  
  const closeSheetPass = useCallback(() =>{
    bottomSheetPass.current?.close();
  },[]);

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
            onPress={() => openSheetPass()}
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

    <BottomSheet
    ref={bottomSheetPass}
    index={-1}
    snapPoints={snapPointsPass}
    enablePanDownToClose={true}
    backdropComponent={renderBackdrop}
    backgroundStyle={styles.bottomSheetBg}
    handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView>
          <View style={styles.inputContainer}>

          <Text style={styles.passText}>Generar Contraseña</Text>
        
        <TouchableOpacity style={{alignSelf:"flex-end",marginRight:20}} onPress={()=> generate()} >
          <View style={styles.iconPass}>
             <FontAwesome5 name="sync-alt" size={20} color={isDark? "white" : "#3c5ce9e3"} />
           </View>
        </TouchableOpacity>
         

         <Text style={styles.textPass}>
            {randomPass}
         </Text>

          <Button style={styles.buttonPass} textColor='white' onPress={()=> copyToClipboard(randomPass || "", "Contraseña")}>Copiar Seleccion</Button>

          </View>
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
   passText:{
    color:"black",
    marginTop:10,
    fontSize:18,
  },
  inputContainer:{
    alignItems:"center",
    justifyContent:"center",

  },
  textPass:{
    color:"#000000c1",
    fontSize:22,
     width:"50%",
    // alignSelf:"center",
    textAlign:"center",
    height:50,
    backgroundColor: '#ffffff98',
    borderRadius:10,
    padding:10,
    marginTop:40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  iconPass:{
    backgroundColor: '#d8d8d883',
    flexDirection:"row",
    borderRadius:100,
    padding:8
  },
  buttonPass:{
    width:"80%",
    padding:2,
    marginTop:100,
    backgroundColor:"#3c5ce9e3",
    fontSize:10,
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
  passText:{
    color:"white",
    marginTop:10,
    fontSize:18,
  },
  inputContainer:{
    alignItems:"center",
    justifyContent:"center",

  },
  textPass:{
    color:"#dad8d8c1",
    fontSize:22,
     width:"50%",
    // alignSelf:"center",
    textAlign:"center",
    height:50,
    backgroundColor: '#0e0e0ec2',
    borderRadius:10,
    padding:10,
    marginTop:40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  iconPass:{
    backgroundColor: '#0e0e0ee3',
    flexDirection:"row",
    borderRadius:100,
    padding:8
  },
  buttonPass:{
    width:"80%",
    padding:2,
    marginTop:100,
    backgroundColor:"#3c5ce9e3",
    fontSize:10,
  }
});