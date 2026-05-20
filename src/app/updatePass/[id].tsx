import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPasswords, PasswordEntry } from "@/utils/storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from "@/context/ThemeContext";
import { Avatar, Button } from "react-native-paper";
import { TextInput } from "react-native-gesture-handler";



    export default function UpdatedPass(){
    
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    const {id} = useLocalSearchParams();
    const router = useRouter();
    const [password, setPassword] =useState<PasswordEntry | null>(null);
    /////Estados para actualizar los campos de la pass
    const [site, setSite] = useState("");
    const [username, setUsername] = useState<PasswordEntry["username"]>("");
    const [pass, setPass] = useState<PasswordEntry["password"]>("");

    
    //Estado para ver o no la pass
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const fetchPassword = async () => {
            const pass = await getPasswords();
            const found = pass.find((p)=> p.id === id);
            setPassword(found || null);
        }
        fetchPassword();
    },[id]);

    ///UseEffect para actualizar los estados de los campos con la pass encontrada
    useEffect(() =>{
        if(password){
            setSite(password.site);
            setUsername(password.username);
            setPass(password.password);
        }else{
            setSite("");
            setUsername("");
            setPass("");
        }

    },[password]);

    const copyToClipboard = async (text: string, label: string) => {
            await Clipboard.setStringAsync(text);
            alert(`${label} copiado al portapapeles`)
        };

        const getFavIcon = (domain: string)=>{
            const cleanedDomain = domain.trim().toLocaleLowerCase();
           return `https://www.google.com/s2/favicons?sz=128&domain=${cleanedDomain}.com`;
        }

    if(!password){
        return(
            <View style={styles.container}>
                <Text style={styles.backText}>Cargando contraseña...</Text>
            </View>
        );
    }
        
         return (

        <ScrollView
            style={styles.container}
        >
            {/* Boton para regresar a la pantalla anterior */}
            <TouchableOpacity onPress={() => router.push(`/`)} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={20} color="#333" />
                <Text style={styles.backText}> Volver a Inicio</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                {/* <View style={styles.iconCircle}>
                    <FontAwesome name="lock" size={40} color="white" />
                </View> */}
                <Avatar.Image
                    size={55}
                    source={{ uri: getFavIcon(password.site) }}
                    style={{ backgroundColor: "transparent" }} />
                <Text style={{fontSize:15, color:"white", marginTop:10}}>Actualizar Contraseña</Text>
                <Text style={styles.title}>{password.site}</Text>

            </View>

            <View style={styles.card}>
                {/* Sitio */}
                <View style={styles.section}>
                    <Text style={styles.label}>Sitio</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome name="user" size={18} color="#666" />
                         <TextInput value={site} onChangeText={(text) => setSite(text)} style={styles.value} />
                        {/* <Text style={styles.value}>{password.site}</Text> */}
                    </View>
                </View>
                {/* Usuario */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nombre de Usuario / Correo</Text>
                    <View style={styles.infoRow}>
                        <FontAwesome name="user" size={18} color="#666" />
                        {/* funcion para copiar usuario al portapapeles */}
                        {/* <TouchableOpacity onPress={() => copyToClipboard(password.username || "", "Usuario")}>
                            <Text style={styles.value}>{password.username}</Text>
                        </TouchableOpacity> */}
                        <TextInput value={username} onChangeText={(text)=> setUsername(text)} style={styles.value}/>
                    </View>
                </View>

                {/* passeord con logica de ver/ocultar */}
                <View style={styles.sectionDivider} />

                <View style={styles.section}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.passwordRow}>
                        <View style={styles.infoRow}>
                            <FontAwesome name="key" size={18} color="#666" />
                            {/* funcion para copiar password al portapapeles */}
                            {/* <TouchableOpacity onPress={() => copyToClipboard(password.password || "", "Contraseña")}>*/}
                                
                                {/* <Text style={[styles.value, styles.passwordText]}> */}
                                    {/* estilos para mostrar o no la password */}
                                    <TextInput value={showPassword ? pass : "*************"} onChangeText={(text)=> setPass(text)} style={styles.value}/>
                                    {/* {showPassword ? password.password : "*************"} */}
                                {/* </Text> */}
                            {/* </TouchableOpacity> */}

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
            <View>
                <Button>Guardar</Button>
            </View>
            {/* <View style={styles.metadataSection}>
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
            </View> */}
            {/* <Text style={styles.footerNote}>
                Esta información está protegida localmente en tu dispositivo.
            </Text> */}
        </ScrollView>

    );
}

const lightStyles = StyleSheet.create({
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
        paddingTop: 10,
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
        borderWidth:1,
        borderColor:"red",
        borderRadius:5
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
        marginBottom: 30,
    },
    backText: {
        fontSize: 16,
        color: "#fff",
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
        color: "#fff",
        paddingTop: 10,
    },
    card: {
        backgroundColor: "#23242a", // Tarjeta más oscura
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
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
        backgroundColor: "#333", // Divider más oscuro
        marginVertical: 10,
    },
    label: {
        fontSize: 13,
        color: "#bbb", // Etiquetas gris claro
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
        color: "#fff", // Valores claros
        fontWeight: "600",
         borderWidth:1,
        borderColor:"red",
        borderRadius:5
    },
    passwordText: {
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        color: "#fff",
    },
    eyeButton: {
        padding: 10,
    },
    footerNote: {
        textAlign: "center",
        color: "#888", // Nota en gris
        marginTop: 40,
        fontSize: 12,
        fontStyle: "italic",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 100,
        fontSize: 16,
        color: "#888",
    },
    metadataSection: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    metadataText: {
        fontSize: 12,
        color: '#bbb',
        fontStyle: 'italic',
    },
});
    