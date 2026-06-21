import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPasswords, PasswordEntry, updatePasswords } from "@/utils/storage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "react-native-paper";
import generatePassword from "@/utils/passwordGenerate"

export default function UpdatedPass() {
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState<PasswordEntry | null>(null);

    /////Estados para actualizar los campos de la pass
    const [site, setSite] = useState("");
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState<PasswordEntry["password"]>("");

    // Estado para controlar qué campo está enfocado (para estilos de borde activo)
    const [activeField, setActiveField] = useState<"site" | "username" | "password" | null>(null);

    //Estado para ver o no la pass
    const [showPassword, setShowPassword] = useState(false);

    //UseEffect para cargar la pass a actualizar segun el ID que se le paso por params
    useEffect(() => {
        const fetchPassword = async () => {
            const list = await getPasswords();
            const found = list.find((p) => p.id === id);
            setPassword(found || null);
        };
        fetchPassword();
    }, [id]);

    ///UseEffect para actualizar los estados de los campos con la pass encontrada
    useEffect(() => {
        if (password) {
            setSite(password.site);
            setUsername(password.username);
            setPass(password.password || "");
        } else {
            setSite("");
            setUsername("");
            setPass("");
        }
    }, [password]);

    const handleUpdate = async () => {
        if (!site.trim() || !username.trim() || !pass?.trim()) {
            if (Platform.OS === "web") {
                alert("Por favor, completa todos los campos obligatorios.");
            } else {
                Alert.alert("Campos vacíos", "Por favor, completa todos los campos obligatorios.");
            }
            return;
        }

        try {
            const updateEntry = {
                id: id as string,
                site: site.trim(),
                username: username.trim(),
                password: pass
            };
            await updatePasswords(updateEntry);

            if (Platform.OS === "web") {
                alert("Contrasena actualizada correctamente");
            } else {
                Alert.alert("Actualizacion exitosa", "La contraseña se ha guardado de forma segura.");
            }
            router.push(`/`);
        } catch (error) {
            if (Platform.OS === "web") {
                alert("Hubo un error al intentar actualizar: " + error);
            } else {
                Alert.alert("Error", "No se pudo actualizar la contraseña.");
            }
        }
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
    //funcion para generar una contrasena segura
    const handleGeneratePass = () =>{
        setPass(generatePassword(16))
        if(Platform.OS === "web")return alert("Contrasena generada con exito");
            else return Alert.alert("Contrasena generada correctamente")
    };
    
    
    const getFavIcon = (domain: string) => {
        const cleanedDomain = domain?.trim().toLowerCase() || "";
        return `https://www.google.com/s2/favicons?sz=128&domain=${cleanedDomain}.com`;
    };

    if (!password) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Cargando contraseña...</Text>
            </View>
        );
    }

    const iconColor = (fieldName: "site" | "username" | "password") => {
        if (activeField === fieldName) {
            return theme === "dark" ? "#5f78ca" : "#285089";
        }
        return theme === "dark" ? "#898888" : "#999999";
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            {/* Boton para regresar a la pantalla anterior */}
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
                <Text style={styles.subtitle}>Actualizar Contraseña</Text>
                <Text style={styles.title}>{password.site}</Text>
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
                            value={site}
                            onChangeText={setSite}
                            style={styles.textInput}
                            placeholder="Ej: google.com"
                            placeholderTextColor={theme === "dark" ? "#666" : "#bbb"}
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

                {/* Usuario */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nombre de Usuario / Correo</Text>
                    <View style={[
                        styles.inputWrapper,
                        activeField === "username" && styles.inputWrapperActive
                    ]}>
                        <FontAwesome5 name="user" size={18} color={iconColor("username")} style={styles.inputIcon} />
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            style={styles.textInput}
                            placeholder="Nombre de Usuario / Correo"
                            placeholderTextColor={theme === "dark" ? "#666" : "#bbb"}
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
                </View>

                {/* passeord con logica de ver/ocultar */}
                <View style={styles.sectionDivider} />

                {/* Contraseña */}
                <View style={styles.section}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={[
                        styles.inputWrapper,
                        activeField === "password" && styles.inputWrapperActive
                    ]}>
                        <FontAwesome5 name="key" size={18} color={iconColor("password")} style={styles.inputIcon} />

                        {/* estilos para mostrar o no la password */}
                        <TextInput
                            value={pass}
                            onChangeText={setPass}
                            style={[styles.textInput, styles.monospaceFont]}
                            placeholder="Contraseña"
                            placeholderTextColor={theme === "dark" ? "#666" : "#bbb"}
                            secureTextEntry={!showPassword}
                            onFocus={() => setActiveField("password")}
                            onBlur={() => setActiveField(null)}
                            autoCapitalize="none"
                        />

                        {/* El botón que cambia el estado booleano */}
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.fieldActionButton}
                        >
                            <FontAwesome5
                                name={showPassword ? "eye" : "eye-slash"}
                                size={16}
                                color={theme === "dark" ? "#bbb" : "#666"}
                            />
                        </TouchableOpacity>

                        {/* Botón copiar contraseña */}
                        {pass ? (
                            <TouchableOpacity
                                onPress={() => copyToClipboard(pass, "Contraseña")}
                                style={styles.fieldActionButton}
                            >
                                <FontAwesome5
                                    name="copy"
                                    size={15}
                                    color={theme === "dark" ? "#bbb" : "#666"}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {/* Generar Contraseña */}
                    <TouchableOpacity onPress={()=> handleGeneratePass()} style={styles.magicGenButton}>
                        <FontAwesome5 name="magic" size={12} color="#5f78ca" />
                        <Text style={styles.magicGenButtonText}> Generar contraseña segura</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botón Guardar Cambios */}
            <View style={styles.buttonOuterContainer}>
                <TouchableOpacity onPress={handleUpdate} style={styles.saveSubmitButton}>
                    <FontAwesome5 name="save" size={16} color="#ffffff" />
                    <Text style={styles.saveSubmitButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
            </View>

            {/* Fecha de Creación */}
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
        backgroundColor: "#23242a", // Tarjeta más oscura
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
        backgroundColor: "#32343c", // Divider más oscuro
        marginVertical: 12,
    },
    label: {
        fontSize: 11,
        color: "#bbb", // Etiquetas gris claro
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
        color: "#ffffff", // Valores claros
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
        color: "#888", // Nota en gris
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
