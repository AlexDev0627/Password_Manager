import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPasswords, PasswordEntry } from "@/utils/storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "react-native-paper";



    export default function UpdatedPass(){
    
    const { theme } = useTheme();
    const styles = theme === "dark" ? darkStyles : lightStyles;
    


        return(
            <View style={styles.container}>
                <Text style={styles.text}>Actualizar Contraseña</Text>
            </View>
        );
    }

    const lightStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
        },
        text:{
            color:"black",
        }

    });

    const darkStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#333',
            padding: 20,
        },
        text:{
            color:"white",
        }
    });
