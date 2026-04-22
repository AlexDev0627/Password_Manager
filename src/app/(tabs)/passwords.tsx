import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { savePassword } from "@/utils/storage";
import { useTheme } from "@/context/ThemeContext";

export default function Pass() {
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    const [site, setSite] = useState("");
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
        } catch (error) {
            alert("Error al guardar la contraseña.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Sitio web o app"
                placeholderTextColor={theme === "dark" ? "#888" : "#666"}
                value={site}
                onChangeText={setSite}
            />
            <TextInput
                style={styles.input}
                placeholder="Usuario o correo"
                placeholderTextColor={theme === "dark" ? "#888" : "#666"}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={theme === "dark" ? "#888" : "#666"}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        padding: 24,
    },
    title: {
        color: "#222",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        backgroundColor: "#fff",
        color: "#222",
        borderRadius: 8,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#2e499aff",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#2e499aff",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
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
        justifyContent: "center",
        padding: 24,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        backgroundColor: "#23242a",
        color: "#fff",
        borderRadius: 8,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#333",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#2e499aff",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});