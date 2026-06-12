import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { savePassword } from "@/utils/storage";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function Pass() {
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    const [site, setSite] = useState("");
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSavePassword = async () => {
        if (!site || !username || !password) {
            alert("Por favor completa todos los campos antes de guardar.");
            return;
        }

        try {
            await savePassword({
                id: Date.now().toString(),
                site,
                username,
                password,
                createdAt: Date.now()
            });

            alert("Contraseña guardada correctamente.");

            setSite("");
            setUsername("");
            setPassword("");
            router.push("/");

        } catch (error) {
            alert("Error al guardar la contraseña.");
        }
    };

    return (
          <ScrollView contentContainerStyle={styles.container}>
           <TouchableOpacity onPress={() => router.push(`/`)} style={styles.backButton}>
                        <FontAwesome5 name="arrow-left" size={16} color={theme === "dark" ? "#ffffff" : "#333333"} />
                        <Text style={styles.backText}> Volver a Inicio</Text>
            </TouchableOpacity>

     
            <Text style={styles.title}>Crear Contraseña</Text>
        <View style={styles.card}>
            
          <View style={styles.section}>
            <Text style={styles.label}>Sitio</Text>
            <View style={styles.inputWrapper}>
            <FontAwesome5 name="globe" size={16} color={theme === "dark" ? "#888" : "#555"} style={styles.inputIcon} />
            <TextInput
                style={styles.textInput}
                placeholder="Ej: Google.com"
                placeholderTextColor={theme === "dark" ? "#888" : "#999"}
                value={site}
                onChangeText={setSite}
                />
            </View>
            
          <View style={styles.section}>
            <Text style={styles.label}>Usuario</Text>
            <View style={styles.inputWrapper}>
            <FontAwesome5 name="user" size={16} color={theme === "dark" ? "#888" : "#555"} style={styles.inputIcon} />
            <TextInput
                style={styles.textInput}
                placeholder="example@gmail.com"
                placeholderTextColor={theme === "dark" ? "#888" : "#999"}
                value={username}
                onChangeText={setUsername}
            />
            </View>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
            <FontAwesome5 name="lock" size={16} color={theme === "dark" ? "#888" : "#555"} style={styles.inputIcon} />
            <TextInput
                style={styles.textInput}
                placeholder="Contraseña"
                placeholderTextColor={theme === "dark" ? "#888" : "#999"}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            </View>
            </View>
        </View>
    </View>
            <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
         justifyContent: "center",
        padding: 24,
    },
   card:{  
        width: "100%",
        backgroundColor: "#f6f7ff9c", 
        borderRadius: 18,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        maxWidth: 400,
        alignSelf: "center",
        alignItems:"center",
        borderWidth: 1,
        borderColor: "#eeeeeed9",
    },

    section:{
        marginVertical: 10,
    },
     label: {
        fontSize: 13,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
     backButton: {
        flexDirection: "row",
        position: "absolute",
        top: 40,
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "500",
    },
    title: {
        color: "#222",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e4e4e65e",
        borderWidth: 1.5,
        borderColor: "#4f4c4c2a",
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 50,
        width: "100%",
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    textInput: {
            flex: 1,
            fontSize: 16,
            color: "#0b0a0a93", 
            fontWeight: "600",
            paddingVertical: Platform.OS === "ios" ? 14 : 10,
        },
     inputIcon:{
        marginRight: 10,
    },
    button: {
        backgroundColor: "#285089ff",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        shadowColor: "#285089",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#181a20",
        padding: 20,
        justifyContent: "center",
    },
    card:{  
        width: "100%",
        backgroundColor: "#23242a", // Tarjeta más oscura
        borderRadius: 18,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        maxWidth: 400,
        alignSelf: "center",
        alignItems:"center",
        borderWidth: 1,
        borderColor: "#32343c",
    },
     section:{
        marginVertical: 10,
    },
     label: {
        fontSize: 13,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
     backButton: {
        flexDirection: "row",
        position: "absolute",
        top: 40,
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "500",
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
     inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#10111551",
        borderWidth: 1.5,
        borderColor: "#6b6b6b43",
        borderRadius: 12,
        paddingHorizontal: 14,
        shadowColor: "#000",
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 50,
        width: "100%",
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#ffffff", 
        fontWeight: "600",
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
    },
    inputIcon:{
        marginRight: 10,
    },
    button: {
        backgroundColor: "#285089ff",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        shadowColor: "#285089",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});