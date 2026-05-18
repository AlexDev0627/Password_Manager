import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Alert } from 'react-native';
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';

const PASSWORDS_KEY = 'saved_passwords';

export interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password?: string;
  createdAt?: number;
}


// Guarda una nueva password en la lista persistente
// Usa SecureStore en nativo y localStorage en Web

export async function savePassword(newEntry: PasswordEntry): Promise<void> {
  try {
    const existingPasswords = await getPasswords();
    const updatedPasswords = [newEntry, ...existingPasswords];
    const stringValue = JSON.stringify(updatedPasswords);

    if (Platform.OS === 'web') {

      localStorage.setItem(PASSWORDS_KEY, stringValue);
    } else {
      await SecureStore.setItemAsync(PASSWORDS_KEY, stringValue);
    }
  } catch (error) {
    console.error("Error saving password:", error);
    throw error;
  }
}

// Funcion para obtener las pass guardadas

export async function getPasswords(): Promise<PasswordEntry[]> {
  try {
    let result: string | null = null;

    if (Platform.OS === 'web') {
      result = localStorage.getItem(PASSWORDS_KEY);
    } else {
      result = await SecureStore.getItemAsync(PASSWORDS_KEY);
    }

    return result ? JSON.parse(result) : [];
  } catch (error) {
    console.error("Error getting passwords:", error);
    return [];
  }
}

// Funcion para rliminar una password por su ID

export async function deletePassword(id: string): Promise<void> {
  try {
    const existingPasswords = await getPasswords();
    const updatedPasswords = existingPasswords.filter(p => p.id !== id);
    const stringValue = JSON.stringify(updatedPasswords);

    if (Platform.OS === 'web') {
      localStorage.setItem(PASSWORDS_KEY, stringValue);
    } else {
      await SecureStore.setItemAsync(PASSWORDS_KEY, stringValue);
    }
  } catch (error) {
    console.error("Error deleting password:", error);
    throw error;
  }
}

export async function updatePasswords(updatedEntry: PasswordEntry): Promise<void> {
  try {
    //Buscamos las pass
    const existingPasswords = await getPasswords();
    //Actualizamos la pass que coincida con el ID manteniendo las demas sin cambios
    const updatedPasswords = existingPasswords.map((pass) => pass.id === updatedEntry.id ? { ...pass, ...updatedEntry } : pass);
    //Formateamos el array actualizado a string para guardarlo
    const stringValue = JSON.stringify(updatedPasswords);

    if (Platform.OS === "web") {
      localStorage.setItem(PASSWORDS_KEY, stringValue);
    } else {
      await SecureStore.setItemAsync(PASSWORDS_KEY, stringValue);
    }

  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}
export async function saveMultiplePasswords(newEntries: PasswordEntry[]): Promise<void> {
  try {
    const existingPasswords = await getPasswords();
    //sanitizamos los id para que sean de tipo string
    const sanitizedEntries = newEntries.map((pass) => ({
      ...pass,
      id: String(pass.id)
    }))
    //creamos un nuevo mapa con los datos sanitizados
    const newEntriesMap = new Map(sanitizedEntries.map(pass => [pass.id, pass]));
    //filtramos
    const updatedPasswords = [...existingPasswords.filter((pass) => !newEntriesMap.has(pass.id)), ...sanitizedEntries]
    const stringValue = JSON.stringify(updatedPasswords);

    if (Platform.OS === "web") {
      alert("Contraseñas importadas correctamente")
      localStorage.setItem(PASSWORDS_KEY, stringValue)
    } else {
      Alert.alert("Importación exitosa", "Contraseñas importadas correctamente")
      SecureStore.setItemAsync(PASSWORDS_KEY, stringValue);
    }
  } catch (error) {
    if (Platform.OS === "web") {
      alert("Error al guardar")
    } else {
      Alert.alert("Error al intentar guardar")
    }
  }
}