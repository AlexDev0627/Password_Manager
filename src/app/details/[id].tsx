import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPasswords, PasswordEntry } from "@/utils/storage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "react-native-paper";

export default function Details() {
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;

    //obtenemos el id de la pass
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState<PasswordEntry | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    //funcion para copiar al portapapeles
    const copyToClipboard = async (text: string, label: string) => {
        if (!text) return;
        await Clipboard.setStringAsync(text);
        if (Platform.OS === "web") {
            alert(`${label} copiado al portapapeles`);
        } else {
            Alert.alert("Copiado", `${label} copiado correctamente.`);
        }
    }

    //funcion para cargar la pass
    useEffect(() => {
        const load = async () => {
            const list = await getPasswords();
            const found = list.find(p => p.id === id);
            setPassword(found || null);
        };
        load();
    }, [id]);

    //si no hay pass mostramos un mensaje de cargando
    if (!password) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Cargando información...</Text>
            </View>
        );
    }

    //funcion para obtener el icono del sitio
    const getFavIcon = (domain: string) => {
        const cleanedDomain = domain?.trim().toLowerCase() || "";
        if (!cleanedDomain) return "https://www.google.com/s2/favicons?sz=128&domain=example.com";
        return `https://www.google.com/s2/favicons?sz=128&domain=${cleanedDomain}.com`;
    };

    //renderizamos la pantalla
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => router.push(`/`)} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={16} color={theme === "dark" ? "#ffffff" : "#333333"} />
                <Text style={styles.backText}> Volver a Inicio</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image
                        size={64}
                        source={{ uri: getFavIcon(password.site) }}
                        style={{ backgroundColor: "transparent" }}
                    />
                </View>
                <Text style={styles.subtitle}>Detalles de Cuenta</Text>
                <Text style={styles.title}>{password.site}</Text>
            </View>

            <View style={styles.card}>
                {/* Sitio */}
                <View style={styles.section}>
                    <Text style={styles.label}>Sitio</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="globe" size={18} color={theme === "dark" ? "#898888" : "#999999"} style={styles.inputIcon} />
                        <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="tail">
                            {password.site}
                        </Text>
                        <TouchableOpacity onPress={() => copyToClipboard(password.site, "Sitio")} style={styles.fieldActionButton}>
                            <FontAwesome5 name="copy" size={15} color={theme === "dark" ? "#bbb" : "#666"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Usuario */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nombre de Usuario / Correo</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="user" size={18} color={theme === "dark" ? "#898888" : "#999999"} style={styles.inputIcon} />
                        <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="tail">
                            {password.username}
                        </Text>
                        <TouchableOpacity onPress={() => copyToClipboard(password.username || "", "Usuario")} style={styles.fieldActionButton}>
                            <FontAwesome5 name="copy" size={15} color={theme === "dark" ? "#bbb" : "#666"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sectionDivider} />

                {/* Contraseña */}
                <View style={styles.section}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="key" size={18} color={theme === "dark" ? "#898888" : "#999999"} style={styles.inputIcon} />
                        <Text style={[styles.valueText, styles.monospaceFont]} numberOfLines={1} ellipsizeMode="tail">
                            {showPassword ? password.password : "••••••••••••••••"}
                        </Text>
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.fieldActionButton}>
                            <FontAwesome5 name={showPassword ? "eye" : "eye-slash"} size={16} color={theme === "dark" ? "#bbb" : "#666"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => copyToClipboard(password.password || "", "Contraseña")} style={styles.fieldActionButton}>
                            <FontAwesome5 name="copy" size={15} color={theme === "dark" ? "#bbb" : "#666"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.buttonOuterContainer}>
                <TouchableOpacity onPress={() => router.push(`/updatePass/${password.id}`)} style={styles.editButton}>
                    <FontAwesome5 name="edit" size={16} color="#ffffff" />
                    <Text style={styles.editButtonText}>Editar Contraseña</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.creationDateSection}>
                <View style={styles.creationRow}>
                    <FontAwesome5 name="calendar-alt" size={12} color={theme === "dark" ? "#666" : "#aaa"} />
                    <Text style={styles.creationDateText}>
                        Creado el: {
                            !password.createdAt
                                ? "No disponible"
                                : isNaN(Number(password.createdAt))
                                    ? password.createdAt
                                    : new Date(Number(password.createdAt)).toLocaleString()
                        }
                    </Text>
                </View>
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
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    valueText: {
        flex: 1,
        fontSize: 16,
        color: "#333333",
        fontWeight: "600",
    },
    monospaceFont: {
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        letterSpacing: 0.5,
    },
    fieldActionButton: {
        padding: 8,
        marginLeft: 4,
    },
    buttonOuterContainer: {
        marginTop: 24,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    editButton: {
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
    editButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
    creationDateSection: {
        marginTop: 25,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eaeaea',
        alignItems: 'center',
    },
    creationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    creationDateText: {
        fontSize: 12,
        color: '#999999',
        fontWeight: "600",
    },
    bottomFooterNote: {
        textAlign: "center",
        color: "#aaa",
        marginTop: 15,
        marginBottom: 35,
        fontSize: 12,
        fontStyle: "italic",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 100,
        fontSize: 16,
        color: "#666666",
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
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1b1c21",
        borderWidth: 1,
        borderColor: "#1b1c21",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    valueText: {
        flex: 1,
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "600",
    },
    monospaceFont: {
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        letterSpacing: 0.5,
    },
    fieldActionButton: {
        padding: 8,
        marginLeft: 4,
    },
    buttonOuterContainer: {
        marginTop: 24,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
    },
    editButton: {
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
    editButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
    creationDateSection: {
        marginTop: 25,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#32343c',
        alignItems: 'center',
    },
    creationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    creationDateText: {
        fontSize: 12,
        color: '#898888',
        fontWeight: "600",
    },
    bottomFooterNote: {
        textAlign: "center",
        color: "#888",
        marginTop: 15,
        marginBottom: 35,
        fontSize: 12,
        fontStyle: "italic",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 100,
        fontSize: 16,
        color: "#888",
    },
});