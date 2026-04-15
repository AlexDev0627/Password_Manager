import { Text, View, StyleSheet} from "react-native";

export default function Index() {
  return (
    <View style = {styles.view}>
      <Text style = {styles.text}>Hello this is my first App in Expo</Text>
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
})
