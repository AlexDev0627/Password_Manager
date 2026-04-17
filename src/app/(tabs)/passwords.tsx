import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { savePassword } from "@/utils/storage";

export default function Pass() {
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
            });

            alert("Contraseña guardada correctamente.");

            // Limpiamos los campos
            setSite("");
            setUsername("");
            setPassword("");
        } catch (error) {
            alert("Error al guardar la contraseña.");
        }
    }


    return (
        <View style={styles.view}>
            <Text style={styles.text}>Password Tab</Text>
            <TextInput style={styles.input}
                placeholder="Enter the site"
                value={site}
                onChangeText={setSite}>
            </TextInput>

            <TextInput
                style={styles.input}
                placeholder="Username or Email"
                value={username}
                onChangeText={setUsername}>
            </TextInput>

            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {/* <TextInput
            style = {styles.input}
            placeholder="Length of password to generate"
            keyboardType="numeric"
            value={length}
            onChangeText={setLength}>
            </TextInput> */}

            {/* <Text style = {styles.button} onPress={() => passwordGenerate(length)}>Generate password</Text> */}
            {/* <Text style={{ backgroundColor: '#a2a2a2a1', marginTop: 10, padding: 10, borderRadius:10 }}>{generatePass}</Text> */}
            <Text style={styles.button} onPress={handleSavePassword}>Guardar</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
    },
    input: {
        borderRadius: 5,
        height: 30,
        paddingHorizontal: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 20,
        color: "rgba(6, 6, 6, 0.84)",
        backgroundColor: "rgba(213, 213, 213, 0.8)",
    },
    button: {
        textAlign: "center",
        alignContent: "center",
        backgroundColor: "rgba(14, 94, 199, 0.97)",
        height: 40,
        width: 100,
        borderRadius: 5,
        color: "rgba(255, 255, 255, 0.93)",
        marginTop: 20,
    }
});
