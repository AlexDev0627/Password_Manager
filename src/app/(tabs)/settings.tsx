import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text, Button, List, Divider } from 'react-native-paper';

export default function Tab() {
  const { theme, setTheme } = useTheme();
  const styles = theme === "dark" ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      <List.Section title="Apariencia" style={styles.section}>
        <List.Item
          title="Modo Claro"
          description="Activar el tema claro de la aplicación"
          left={() => <List.Icon icon="white-balance-sunny" color={styles.iconColor.color} />}
          right={() => (
            <Button
              mode={theme === "light" ? "contained" : "outlined"}
              onPress={() => setTheme("light")}
              disabled={theme === "light"}
            >
              Activar
            </Button>
          )}
          titleStyle={styles.listItemTitle}
          descriptionStyle={styles.listItemDescription}
          style={styles.listItem}
        />
        {/* <Divider /> */}
        <List.Item
          title="Modo Oscuro"
          description="Activar el tema oscuro de la aplicación"
          left={() => <List.Icon icon="moon-waning-gibbous" color={styles.iconColor.color} />}
          right={() => (
            <Button
              mode={theme === "dark" ? "contained" : "outlined"}
              onPress={() => setTheme("dark")}
              disabled={theme === "dark"}
            >
              Activar
            </Button>
          )}
          titleStyle={styles.listItemTitle}
          descriptionStyle={styles.listItemDescription}
          style={styles.listItem}
        />
      </List.Section>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    marginTop: 16,
  },
  listItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 20,
  },
  listItemTitle: {
    color: '#333',
    fontWeight: 'bold',
  },
  listItemDescription: {
    color: '#666',
  },
  iconColor: {
    color: '#333',
  }
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a20',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  section: {
    marginTop: 16,
  },
  listItem: {
    backgroundColor: '#23242a',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    paddingHorizontal: 20,
  },
  listItemTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItemDescription: {
    color: '#bbb',
  },
  iconColor: {
    color: '#fff',
  }
});