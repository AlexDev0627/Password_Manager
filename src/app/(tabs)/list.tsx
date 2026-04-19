import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from "react-native";
import { useFocusEffect } from "expo-router";
import { getPasswords, deletePassword, PasswordEntry } from "@/utils/storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function List() {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

    const loadPasswords = useCallback(async () => {
        const stored = await getPasswords();
        setPasswords(stored);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadPasswords();
        }, [loadPasswords])
    );

    const handleDelete = async (id: string) => {
        if (Platform.OS === "web") {
            const confirmed = confirm("Estas seguro que quieres eliminar la clave?");
            if (confirmed) {
                await deletePassword(id);
                loadPasswords();
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

    const renderItem = ({ item }: { item: PasswordEntry }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.siteText}>{item.site}</Text>
                <Text style={styles.userText}>{item.username}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <FontAwesome name="trash" size={24} color="#ff4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis Contraseñas</Text>

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
        </View>
    );
}

const styles = StyleSheet.create({
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
        alignContent: "center",
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: 300,
        height: 120,
    },
    cardInfo: {
        flex: 1,
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
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    }
});