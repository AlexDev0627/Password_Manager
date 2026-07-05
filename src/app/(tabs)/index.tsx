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
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard';
import { BlurView } from "expo-blur";



export default function Index() {
    //funcion para abrir un modalBottomSheet
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    //con useMemo definicmos los puntos de altura
    const snapPoints = useMemo(() => ['25%', '70%'], []);
    // funcion para abrir el modal
    const openSheet = () => { bottomSheetRef.current?.present(); }
    // funcion para cerrar el modal
    const closeSheet = () => { bottomSheetRef.current?.dismiss() }
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
    const isDark = theme === "dark";
    const styles = isDark ? darkStyles : lightStyles
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    //estado para saber que elemento se selecciono del modal
    const [selectedItem, setSelectedItem] = useState<PasswordEntry | null>(null);
    //estado para la busqueda
    const [query, setQuery] = useState("");
    //estado para el focus de la barra de busqueda
    const [isFocused, setIsFocused] = useState(false);

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
        // si el domain es undefined .trim() no se ejecuta y devuelve un valor por defecto
        const cleadDomain = domain?.trim().toLocaleLowerCase() || "";

        return `https://www.google.com/s2/favicons?sz=128&domain=${cleadDomain}.com`;
    };
    // Funcion para copiar en el clipboard
    const copyToClipboard = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        alert(`${label} copiado al portapapeles`);
        closeSheet();
    };

    //funcion para filtrar por búsquedas las passwords
    const filteredPasswords = passwords.filter((pass) => pass.site.toLowerCase().includes(query.toLowerCase()));


    // Funciona para renderizar cada item de la lista, en este caso las passwords
    const renderItem = ({ item }: { item: PasswordEntry }) => (
        <View style={styles.card} key={item.id}>
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



    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.header}>Gestor de contraseñas</Text>
                <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                    <FontAwesome5
                        name="search"
                        size={16}
                        color={isFocused ? '#5f78ca' : (theme === "dark" ? '#888' : '#777')}
                    />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar..."
                        placeholderTextColor={theme === "dark" ? '#555' : '#aaa'} // placeholder también se adapta al tema
                        style={styles.searchInput}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery("")} style={styles.clearButton}>
                            <FontAwesome5
                                name="times-circle"
                                size={16}
                                color={theme === "dark" ? '#888' : '#777'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* // Si no hay passwords guardaddas devolvemos el siguiente mensaje */}
                {/* ////////////////////////// */}
                {passwords.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes contraseñas guardadas aún.</Text>
                ) : filteredPasswords.length === 0 ? (
                    <Text style={styles.emptyText}>No hay coincidencias para {query}</Text>
                ) : (

                    <FlatList
                        data={filteredPasswords}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />
                )}

                {/* modalBottomSheet */}
                {/* <Button title="Configuraciones" onPress={openSheet} /> */}
                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={1} // en BottomSheetModal el index define qué snapPoint inicial usar
                    snapPoints={snapPoints}
                    enablePanDownToClose={true} // Permite cerrar al deslizar abajo
                    backdropComponent={renderBackdrop} // Fondo personalizado
                    backgroundStyle={{ backgroundColor: "transparent" }}
                    backgroundComponent={() => (
                        <View
                            style={[StyleSheet.absoluteFill,
                            {
                                overflow: "hidden",
                                borderTopLeftRadius: 32,
                                borderTopRightRadius: 32,
                                borderWidth: 1.5,
                                borderBottomWidth: 0,
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.27)',
                            }
                            ]}
                        >

                            <BlurView
                                intensity={30}
                                tint={isDark ? "dark" : "light"}
                                style={StyleSheet.absoluteFill}
                            >

                            </BlurView>

                            {/* Capa de color para dar el tono deseado sobre el blur */}
                            <View
                                style={[
                                    StyleSheet.absoluteFill,
                                    {
                                        backgroundColor: isDark ? 'rgba(28, 31, 38, 0.65)' : 'rgba(248, 250, 252, 0.74)'
                                    }
                                ]}
                            />
                        </View>
                    )}
                    handleIndicatorStyle={styles.handleIndicator}
                >
                    <BottomSheetView style={styles.modalContent}>
                        {selectedItem && (
                            <View style={styles.modalHeader}>
                                <Avatar.Image
                                    size={40}
                                    source={{ uri: getFavIcon(selectedItem.site) }}
                                    style={styles.modalAvatar}
                                />
                                <View style={styles.modalHeaderTitleContainer}>
                                    <Text style={styles.siteModalText}>{selectedItem.site}</Text>
                                    <Text style={styles.userModalText}>{selectedItem.username}</Text>
                                </View>
                            </View>
                        )}

                        <GHTouchableOpacity onPress={() => {
                            if (selectedItem && selectedItem.id) {
                                router.push(`/updatePass/${selectedItem.id}`);
                                closeSheet();
                            }
                        }} style={styles.modalOption}>
                            <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#1e293b' : '#eef2ff' }]}>
                                <FontAwesome5 name="edit" size={16} color="#5f78ca" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Editar contraseña</Text>
                            </View>
                        </GHTouchableOpacity>

                        <GHTouchableOpacity onPress={() => selectedItem && copyToClipboard(selectedItem.username || "", "Email")} style={styles.modalOption}>
                            <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#162e24' : '#f0fdf4' }]}>
                                <FontAwesome5 name="envelope" size={16} color="#10b981" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Copiar Email</Text>
                            </View>
                        </GHTouchableOpacity>

                        <GHTouchableOpacity onPress={() => selectedItem && copyToClipboard(selectedItem.password || "", "Contrasena")} style={styles.modalOption}>
                            <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#2e251b' : '#fef3c7' }]}>
                                <FontAwesome5 name="key" size={16} color="#d97706" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Copiar Password</Text>
                            </View>
                        </GHTouchableOpacity>

                        <GHTouchableOpacity onPress={() => selectedItem && handleDelete(selectedItem.id)} style={styles.modalOption}>
                            <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#3b1e1e' : '#fef2f2' }]}>
                                <FontAwesome5 name="trash" size={16} color="#ef4444" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Eliminar</Text>
                            </View>
                        </GHTouchableOpacity>

                        <GHTouchableOpacity onPress={closeSheet} style={styles.modalOption}>
                            <View style={[styles.iconContainer, { backgroundColor: theme === "dark" ? '#2d3139' : '#f1f5f9' }]}>
                                <FontAwesome5 name="times" size={16} color="#64748b" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Cerrar Modal</Text>
                            </View>
                        </GHTouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 25,
        width: 350,
        height: 50,
        alignSelf: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    searchContainerFocused: {
        borderColor: '#5f78ca',
        shadowColor: '#5f78ca',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#1a202c',
        fontSize: 16,
        paddingVertical: 0,
        marginLeft: 10,           // Separa el texto del icono
    },
    clearButton: {
        padding: 4,
        marginLeft: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        alignItems: "center",
        paddingBottom: 100,
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
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 24,
        height: 520,
        alignItems: 'stretch',
        width: '100%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalAvatar: {
        backgroundColor: 'transparent',
    },
    modalHeaderTitleContainer: {
        marginLeft: 16,
    },
    siteModalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    userModalText: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eeeeeec5',
        padding: 12,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9e9e9ff',
        width: '100%',
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },

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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f222a',
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 25,
        width: 350,
        height: 50,
        alignSelf: 'center',
        borderWidth: 1.5,
        borderColor: '#2d3139',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    searchContainerFocused: {
        borderColor: '#5f78ca',
        shadowColor: '#5f78ca',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#ffffff',
        fontSize: 16,
        paddingVertical: 0,
        marginLeft: 10,
    },
    clearButton: {
        padding: 4,
        marginLeft: 5,
    },
    listContent: {
        paddingHorizontal: 20,
        alignItems: "center",
        paddingBottom: 100,

    },
    card: {
        alignContent: "center",
        backgroundColor: '#23242a',
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
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 24,
        height: 520,
        alignItems: 'stretch',
        width: '100%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2e333d',
    },
    modalAvatar: {
        backgroundColor: 'transparent',
    },
    modalHeaderTitleContainer: {
        marginLeft: 16,
    },
    siteModalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userModalText: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 2,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252932',
        padding: 12,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#2e333d',
        width: '100%',
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
    },
});