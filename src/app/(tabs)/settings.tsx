import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function Tab() {
  const { theme, setTheme } = useTheme();
  const styles = theme === "dark" ? darkStyles : lightStyles;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tab Settings</Text>
      <Button
        title="Modo Claro"
        onPress={() => setTheme("light")}
        disabled={theme === "light"}
      />
      <Button
        title="Modo Oscuro"
        onPress={() => setTheme("dark")}
        disabled={theme === "dark"}
      />
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    color: 'black',
    fontSize: 20,
    marginBottom: 20,
  }
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181a20',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  
});