import { View, Text, StyleSheet } from "react-native";

export default function Notes(){
    return(
        <View style = {styles.view}>
            <Text style = {styles.text}>Tab Notes</Text>
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
    }
});