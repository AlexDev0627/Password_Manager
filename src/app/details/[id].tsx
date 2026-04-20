import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPasswords, PasswordEntry } from "@/utils/storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';

export default function Details() {
    const { id } = useLocalSearchParams(); // Obtenemos el ID de la card que tocamos
    const router = useRouter();
    const [password, setPassword] = useState<PasswordEntry | null>(null);
    const [showPassword, setShowPassword] = useState(false); // Estado para el "ojito"

    // Funcion para copiar en el clipboard
    const copyToClipboard = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        alert(`${label} copiado al portapapeles`)
    }


    // Esta funcion busca la contraseña en el almacenamiento usando el ID
    useEffect(() => {
        const load = async () => {
            const list = await getPasswords();
            const found = list.find(p => p.id === id);
            setPassword(found || null);
        };
        load();
    }, [id]);

    if (!password) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Cargando información...</Text>
            </View>
        );
    }
    { console.log("El valor de createdAt es:", password.createdAt) }

    return (

        <ScrollView style={styles.container}>
            {/* Boton para regresar a la pantalla anterior */}
            <TouchableOpacity onPress={() => router.push(`/list`)} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={20} color="#333" />
                <Text style={styles.backText}> Volver a la lista</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <FontAwesome name="lock" size={40} color="white" />
                </View>
                <Text style={styles.title}>{password.site}</Text>
            </View>

            <View style={styles.card}>
                {/* Sitio */}
                <View style={styles.section}>
                    <Text style={styles.label}>Sitio</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome name="user" size={18} color="#666" />
                        <Text style={styles.value}>{password.site}</Text>
                    </View>
                </View>
                {/* Usuario */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nombre de Usuario / Correo</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome name="user" size={18} color="#666" />
                        <Text style={styles.value}>{password.username}</Text>
                    </View>
                </View>

                {/* passeord con logica de ver/ocultar */}
                <View style={styles.sectionDivider} />

                <View style={styles.section}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.passwordRow}>
                        <View style={styles.infoRow}>
                            <FontAwesome name="key" size={18} color="#666" />
                            <TouchableOpacity onPress={() => copyToClipboard(password.password || "", "Contraseña")}>
                                <Text style={[styles.value, styles.passwordText]}>
                                    {showPassword ? password.password : "*************"}
                                </Text>
                            </TouchableOpacity>

                        </View>

                        {/* El botón que cambia el estado booleano */}
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                        >
                            <FontAwesome
                                name={showPassword ? "eye" : "eye-slash"}
                                size={22}
                                color="#007AFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.metadataSection}>
                <View style={styles.infoRow}>
                    <FontAwesome name="calendar" size={12} color="#999" />
                    <Text style={styles.metadataText}>
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
            <Text style={styles.footerNote}>
                Esta información está protegida localmente en tu dispositivo.
            </Text>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,

    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 30,
    },
    backText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: 400,
        alignSelf: "center"
    },
    section: {
        marginVertical: 10,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },
    label: {
        fontSize: 13,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    passwordRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    value: {
        fontSize: 18,
        color: "#333",
        fontWeight: "600",
    },
    passwordText: {
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    eyeButton: {
        padding: 10,
    },
    footerNote: {
        textAlign: "center",
        color: "#aaa",
        marginTop: 40,
        fontSize: 12,
        fontStyle: "italic",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 100,
        fontSize: 16,
        color: "#666",
    },
    metadataSection: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        alignItems: 'center',
    },
    metadataText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },

});
