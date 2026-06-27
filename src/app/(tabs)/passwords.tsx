import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { savePassword } from "@/utils/storage";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import generatePassword from "@/utils/passwordGenerate";
import { Avatar } from "react-native-paper";
import * as Clipboard from 'expo-clipboard';

export default function Pass() {
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    const router = useRouter();

    const [site, setSite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Estado para controlar qué campo está enfocado (para estilos de borde activo)
    const [activeField, setActiveField] = useState<"site" | "username" | "password" | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setTimeout(() => {
            if (text && !emailRegex.test(text)) {
                setError("Email Inválido");
            } else {
                setError("");
            }
        }, 1300);
        setUsername(text);
    };

    const handleSavePassword = async () => {
        if (!site.trim() || !username.trim() || !password.trim()) {
            if (Platform.OS === "web") {
                alert("Por favor completa todos los campos antes de guardar.");
            } else {
                Alert.alert("Campos vacíos", "Por favor completa todos los campos antes de guardar.");
            }
            return;
        }

        try {
            await savePassword({
                id: Date.now().toString(),
                site: site.trim(),
                username: username.trim(),
                password,
                createdAt: Date.now()
            });

            if (Platform.OS === "web") {
                alert("Contraseña guardada correctamente.");
            } else {
                Alert.alert("Éxito", "Contraseña guardada correctamente.");
            }

            setSite("");
            setUsername("");
            setPassword("");
            router.push("/");

        } catch (error) {
            if (Platform.OS === "web") {
                alert("Error al guardar la contraseña.");
            } else {
                Alert.alert("Error", "Error al guardar la contraseña.");
            }
        }
    };

    const handleGeneratePass = () => {
        setPassword(generatePassword(16));
        if (Platform.OS === "web") return alert("Contraseña generada con éxito");
        else return Alert.alert("Éxito", "Contraseña generada correctamente");
    };

    const copyToClipboard = async (text: string, label: string) => {
        if (!text) return;
        await Clipboard.setStringAsync(text);
        if (Platform.OS === "web") {
            alert(`${label} copiado al portapapeles`);
        } else {
            Alert.alert("Copiado", `${label} copiado correctamente.`);
        }
    };

    const getFavIcon = (domain: string) => {
        const cleanedDomain = domain?.trim().toLowerCase() || "";
        if (!cleanedDomain) return "https://www.google.com/s2/favicons?sz=128&domain=example.com";
        return `https://www.google.com/s2/favicons?sz=128&domain=${cleanedDomain}.com`;
    };

    const iconColor = (fieldName: "site" | "username" | "password") => {
        if (activeField === fieldName) {
            return theme === "dark" ? "#5f78ca" : "#285089";
        }
        return theme === "dark" ? "#898888" : "#999999";
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => router.push(`/`)} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={16} color={theme === "dark" ? "#ffffff" : "#333333"} />
                <Text style={styles.backText}> Volver a Inicio</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Crear Contraseña</Text>
            </View>

            <View style={styles.card}>
                {/* Sitio */}
                <View style={styles.section}>
                    <Text style={styles.label}>Sitio</Text>
                    <View style={[
                        styles.inputWrapper,
                        activeField === "site" && styles.inputWrapperActive
                    ]}>
                        <FontAwesome5 name="globe" size={18} color={iconColor("site")} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ej: google.com"
                            placeholderTextColor={theme === "dark" ? "#666" : "#bbb"}
                            value={site}
                            onChangeText={setSite}
                            onFocus={() => setActiveField("site")}
                            onBlur={() => setActiveField(null)}
                            autoCapitalize="none"
                        />
                        {site ? (
                            <TouchableOpacity onPress={() => copyToClipboard(site, "Sitio")} style={styles.fieldActionButton}>
                                <FontAwesome5 name="copy" size={15} color={theme === "dark" ? "#bbb" : "#666"} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                {/* Usuario / Email */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nombre de Usuario / Correo</Text>
                    <View style={[
                        styles.inputWrapper,
                        activeField === "username" && styles.inputWrapperActive
                    ]}>
                        <FontAwesome5 name="user" size={18} color={iconColor("username")} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="example@gmail.com"
                            placeholderTextColor={theme === "dark" ? "#666" : "#bbb"}
                            value={username}
                            onChangeText={validateEmail}
                            onFocus={() => setActiveField("username")}
                            onBlur={() => setActiveField(null)}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {username ? (
                            <TouchableOpacity onPress={() => copyToClipboard(username, "Usuario")} style={styles.fieldActionButton}>
                                <FontAwesome5 name="copy" size={15} color={theme === "dark" ? "#bbb" : "#666"} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <View style={styles.sectionDivider} />

                {/* Contraseña */}
                <View style={styles.section}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={[
                        styles.inputWrapper,
                        activeField === "password" && styles.inputWrapperActive
                    ]}>
                        <FontAwesome5 name="key" size={18} color={iconColor("password")} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.textInput, styles.monospaceFont]}
                            placeholder="Contraseña"
                            placeholderTextColor={theme === "dark" ? "#666" : "#bbb"}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setActiveField("password")}
                            onBlur={() => setActiveField(null)}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.fieldActionButton}
                        >
                            <FontAwesome5 name={showPassword ? "eye" : "eye-slash"} size={16} color={theme === "dark" ? "#bbb" : "#666"} />
                        </TouchableOpacity>
                        {password ? (
                            <TouchableOpacity onPress={() => copyToClipboard(password, "Contraseña")} style={styles.fieldActionButton}>
                                <FontAwesome5 name="copy" size={15} color={theme === "dark" ? "#bbb" : "#666"} />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {/* Generar Contraseña */}
                    <TouchableOpacity onPress={handleGeneratePass} style={styles.magicGenButton}>
                        <FontAwesome5 name="magic" size={12} color="#5f78ca" />
                        <Text style={styles.magicGenButtonText}> Generar contraseña segura</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botón Guardar */}
            <View style={styles.buttonOuterContainer}>
                <TouchableOpacity onPress={handleSavePassword} style={styles.saveSubmitButton}>
                    <FontAwesome5 name="save" size={16} color="#ffffff" />
                    <Text style={styles.saveSubmitButtonText}>Guardar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.bottomFooterNote}>
                Esta información está protegida localmente en tu dispositivo.
            </Text>
        </ScrollView>
    );
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "500",
    },
    header: {
        alignItems: "center",
        marginBottom: 25,
    },
    avatarContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderRadius: 32,
        backgroundColor: "transparent",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 13,
        color: "#888888",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#111111",
        marginTop: 4,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 18,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#eaeaea",
    },
    section: {
        marginVertical: 10,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginVertical: 12,
    },
    label: {
        fontSize: 11,
        color: "#666666",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.1,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    inputWrapperActive: {
        borderColor: "#285089",
        backgroundColor: "#ffffff",
        shadowColor: "#285089",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#333333",
        fontWeight: "600",
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
    },
    monospaceFont: {
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        letterSpacing: 0.5,
    },
    fieldActionButton: {
        padding: 8,
        marginLeft: 4,
    },
    magicGenButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        alignSelf: "flex-end",
        paddingVertical: 4,
    },
    magicGenButtonText: {
        fontSize: 13,
        color: "#5f78ca",
        fontWeight: "700",
        marginLeft: 4,
    },
    errorText: {
        color: "#d43535ff",
        marginTop: 6,
        marginLeft: 4,
        fontSize: 12,
        fontWeight: "600",
    },
    buttonOuterContainer: {
        marginTop: 24,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    saveSubmitButton: {
        backgroundColor: "#285089ff",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        shadowColor: "#285089",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    saveSubmitButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
    bottomFooterNote: {
        textAlign: "center",
        color: "#aaa",
        marginTop: 25,
        marginBottom: 35,
        fontSize: 12,
        fontStyle: "italic",
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#181a20",
        padding: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "500",
    },
    header: {
        alignItems: "center",
        marginBottom: 25,
    },
    avatarContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        borderRadius: 32,
        backgroundColor: "transparent",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 13,
        color: "#898888",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#ffffff",
        marginTop: 4,
    },
    card: {
        backgroundColor: "#23242a",
        borderRadius: 18,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#32343c",
    },
    section: {
        marginVertical: 10,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: "#32343c",
        marginVertical: 12,
    },
    label: {
        fontSize: 11,
        color: "#bbb",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.1,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1b1c21",
        borderWidth: 1.5,
        borderColor: "#32343c",
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    inputWrapperActive: {
        borderColor: "#5f78ca",
        backgroundColor: "#1b1c21",
        shadowColor: "#5f78ca",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "600",
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
    },
    monospaceFont: {
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        letterSpacing: 0.5,
    },
    fieldActionButton: {
        padding: 8,
        marginLeft: 4,
    },
    magicGenButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        alignSelf: "flex-end",
        paddingVertical: 4,
    },
    magicGenButtonText: {
        fontSize: 13,
        color: "#5f78ca",
        fontWeight: "700",
        marginLeft: 4,
    },
    errorText: {
        color: "#ef4444",
        marginTop: 6,
        marginLeft: 4,
        fontSize: 12,
        fontWeight: "600",
    },
    buttonOuterContainer: {
        marginTop: 24,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    saveSubmitButton: {
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
    },
    saveSubmitButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
    bottomFooterNote: {
        textAlign: "center",
        color: "#888",
        marginTop: 25,
        marginBottom: 35,
        fontSize: 12,
        fontStyle: "italic",
    },
});