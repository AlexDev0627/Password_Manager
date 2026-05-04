import { Text, View, StyleSheet} from "react-native";
import {useTheme} from "@/context/ThemeContext";
import  AvatarText  from "@/components/avatarText";

export default function Index() {
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkStyles : lightStyles;
  return (
    <View style = {styles.container}>
    <View style = {styles.row}>
      <AvatarText />
      <Text style = {styles.text}>Password Manager</Text>
    </View>
    </View>
  );
}

const darkStyles = StyleSheet.create({
  container:{
    backgroundColor: '#181a20',
    height: '100%',

  },
  row:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  text:{
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 25,
    marginRight: 100,

  }
});

const lightStyles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    justifyContent:'center'
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  text:{
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    
  }
})