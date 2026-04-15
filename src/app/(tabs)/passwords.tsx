import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
    
export default function Pass (){
    const [password, setPassword] = useState("");

    return(
        <View style = {styles.view}>
            <Text style = {styles.text}>Tab Passwords</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
        </View>
    );

}

 const styles = StyleSheet.create({
        view:{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        text:{
        },
        input:{
            borderRadius: 5,
            height: 30,
            paddingHorizontal: 10,
            borderColor: "#ccc",
            borderWidth: 1,
            marginTop: 20,
            backgroundColor: "rgba(213, 213, 213, 0.8)",
        }
    });
