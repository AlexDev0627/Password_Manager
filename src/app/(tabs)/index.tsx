import { Text, View, StyleSheet} from "react-native";
import {useTheme} from "@/context/ThemeContext";
export default function Index() {
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkStyles : lightStyles;
  return (
    <View style = {styles.view}>
      <Text style = {styles.text}>Hello this is my first App in Expo</Text>
    </View>
  );
}

const darkStyles = StyleSheet.create({
  view:{
    backgroundColor: '#181a20',
    textAlign: 'center',
    height: '100%',
    justifyContent:'center'

  },
  text:{
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  }
});

const lightStyles = StyleSheet.create({
  view:{
    height:'100%',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    justifyContent:'center'
  },
  text:{
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  }
})