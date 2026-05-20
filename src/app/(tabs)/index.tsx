import AvatarText from "@/components/avatarText";
import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, Button } from "react-native";
import { TouchableOpacity as GHTouchableOpacity } from '@gorhom/bottom-sheet';
import { useFocusEffect, useRouter } from "expo-router";
import { getPasswords, deletePassword, PasswordEntry } from "@/utils/storage";
// import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from "@/context/ThemeContext";
import { Avatar, } from "react-native-paper";
import React, { useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard';



export default function Index() {
    //funcion para abrir un modalBottomSheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    //con useMemo definicmos los puntos de altura
    const snapPoints = useMemo(() => ['25%', '55%'], []);
    // funcion para abrir el modal
    const openSheet = () => { bottomSheetRef.current?.expand(); }
    // funcion para cerrar el modal
    const closeSheet = () => { bottomSheetRef.current?.close() }
    // funcion para renderizar el fondo del modal
    const renderBackdrop = useCallback((props: any) => (
        <BottomSheetBackdrop {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            pressBehavior="close"
        />
    ),
        []
    );

    //Funcion para definir tema
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    //estado para saber que elemento se selecciono del modal
    const [selectedItem, setSelectedItem] = useState<PasswordEntry | null>(null);

    const router = useRouter()
    const loadPasswords = useCallback(async () => {
        const stored = await getPasswords();
        setPasswords(stored);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadPasswords();
        }, [loadPasswords])
    );
    //funcion para eliminar una pass, luego cierra el modal y resetea el selectItem
    const handleDelete = async (id: string) => {
        if (Platform.OS === "web") {
            const confirmed = confirm("¿Estás seguro de que quieres eliminar esta contraseña?");
            if (confirmed) {
                await deletePassword(id);
                loadPasswords();

                closeSheet();
                setSelectedItem(null);
            }
            return;
        }

        Alert.alert(
            "Eliminar",
            "¿Estás seguro de que quieres eliminar esta contraseña?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        await deletePassword(id);
                        loadPasswords();
                    }
                }
            ]
        );
    };
    // funcion para limpiar y buscar la imagen de un dominio
    const getFavIcon = (domain: string) => {
        // formateamos el dominio
        const cleadDomain = domain.trim().toLocaleLowerCase();

        return `https://www.google.com/s2/favicons?sz=128&domain=${cleadDomain}.com`;
    };
    // Funcion para copiar en el clipboard
    const copyToClipboard = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        alert(`${label} copiado al portapapeles`);
        closeSheet();
    }

    // Funciona para renderizar cada item de la lista, en este caso las passwords
    const renderItem = ({ item }: { item: PasswordEntry }) => (
        <View style={styles.card}>
            <Avatar.Image
                size={35}
                source={{ uri: getFavIcon(item.site) }}
                style={{ backgroundColor: "transparent" }} />
            <TouchableOpacity style={
                styles.cardInfo
            } onPress={() => router.push(`/details/${item.id}`)}>
                <Text style={styles.siteText}>{item.site}</Text>
                <Text style={styles.userText}>{item.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                setSelectedItem(item);

                openSheet();
            }}>
                <FontAwesome5 name="ellipsis-v" size={15} color="#898888ff" />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <FontAwesome name="trash" size={24} color="#ff4444" />
            </TouchableOpacity> */}
        </View>
    );


    // Si no hay passwords guardaddas devolvemos el siguiente mensaje
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.header}>Gestor de contraseñas</Text>

                {/* ////////////////////////// */}
                {passwords.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes contraseñas guardadas aún.</Text>
                ) : (

                    <FlatList
                        data={passwords}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />
                )}

                {/* modalBottomSheet */}
                {/* <Button title="Configuraciones" onPress={openSheet} /> */}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1} // -1 significa que inicia OCULTO
                    snapPoints={snapPoints}
                    enablePanDownToClose={true} // Permite cerrar al deslizar abajo
                    backdropComponent={renderBackdrop} // Fondo personalizado
                    backgroundStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: theme === "dark" ? '#181a20' : '#f5f5f5' }}
                >
                    <BottomSheetView style={styles.modalContent}>
                        {/* <Text style={styles.userText}>Contenido del modal</Text> */}
                        {/* //Validamos selectedItem */}
                        {selectedItem && (
                            <Avatar.Image
                                size={45}
                                source={{ uri: getFavIcon(selectedItem.site) }}
                                style={{ backgroundColor: "transparent" }}
                            />
                        )}
                        <Text style={styles.siteModalText}>
                            Sitio: {selectedItem?.site}
                        </Text>
                        <GHTouchableOpacity onPress={() =>{if(selectedItem && selectedItem.id){
                            router.push(`/updatePass/${selectedItem.id}` );
                            closeSheet();
                        }}} style={styles.modalTouch}>
                            <Text style={styles.bottomSheetText}>
                                <FontAwesome5 name="edit" size={20} color="#777" style={{ marginRight: 15, }} />
                                Editar contraseña
                            </Text>
                        </GHTouchableOpacity>
                        <GHTouchableOpacity onPress={() => selectedItem && copyToClipboard(selectedItem.username || "", "Email")} style={styles.modalTouch}>
                            <Text style={styles.bottomSheetText}>
                                <FontAwesome5 name="copy" size={20} color="#777" style={{ marginRight: 15, }} />
                                Copiar Email
                            </Text>
                        </GHTouchableOpacity>
                        <GHTouchableOpacity onPress={() => selectedItem && copyToClipboard(selectedItem.password || "", "Contrasena")} style={styles.modalTouch}>
                            <Text style={styles.bottomSheetText}>
                                <FontAwesome5 name="copy" size={20} color="#777" style={{ marginRight: 15 }} />
                                Copiar Password
                            </Text>
                        </GHTouchableOpacity>

                        <GHTouchableOpacity onPress={() => selectedItem && handleDelete(selectedItem.id)} style={styles.modalTouch}>
                            <Text style={styles.bottomSheetText}>
                                <FontAwesome5 name="trash" size={20} color="#777" style={{ marginRight: 15 }} />
                                Eliminar
                            </Text>
                        </GHTouchableOpacity>

                        <GHTouchableOpacity onPress={closeSheet} style={styles.modalTouch}>
                            <Text style={styles.bottomSheetText}>
                                <FontAwesome5 name="times" size={20} color="#777" style={{ marginRight: 15 }} />
                                Cerrar Modal
                            </Text>
                        </GHTouchableOpacity>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView >
    );
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        alignItems: "center"
    },
    card: {
        flex: 1,
        alignContent: "center",
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: 350,
        height: 70,
    },
    cardInfo: {
        flex: 1,
        paddingHorizontal: 10,
    },
    siteText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    userText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
    siteModalText: {
        paddingTop: 5,
        fontWeight: "bold"
    },
    modalContent: {
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignContent: "center",
        margin: "auto"
    },
    modalTouch: {
        flexDirection: "row",
        width: 400,
        marginTop: 20,
        padding: 10,
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderColor: "#5f78caff",
        borderWidth: 2,
        height: 40
    },
    bottomSheetText: {
        color: "black",
        fontWeight: "500"

    }

});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        paddingTop: 50,
        backgroundColor: '#181a20',
    },
    header: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        alignItems: "center"
    },
    card: {
        alignContent: "center",
        backgroundColor: '#23242a', // Fondo más oscuro para la tarjeta
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        width: 350,
        height: 70,
    },
    cardInfo: {
        flex: 1,
        paddingHorizontal: 10
    },
    siteText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // Texto claro
    },
    userText: {
        fontSize: 14,
        color: '#bbb', // Gris claro para el usuario
        marginTop: 4,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#888', // Gris medio para mensajes vacíos
    },
    siteModalText: {
        paddingTop: 5,
        fontWeight: "bold",
        color: "white"
    },
    modalContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignContent: "center",
        margin: "auto"


    },
    modalTouch: {
        flexDirection: "row",
        width: 400,
        marginTop: 20,
        padding: 10,
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderColor: "#5f78caff",
        borderWidth: 2,
        height: 40
    },
    bottomSheetText: {
        color: 'white',
        fontWeight: "500"
    },
});