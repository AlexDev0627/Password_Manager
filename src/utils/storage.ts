import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PASSWORDS_KEY = 'saved_passwords';

export interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password?: string;
}


// Guarda una nueva contraseña en la lista persistente
// Usa SecureStore en nativo y localStorage en Web

export async function savePassword(newEntry: PasswordEntry): Promise<void> {
  try {
    const existingPasswords = await getPasswords();
    const updatedPasswords = [...existingPasswords, newEntry];
    const stringValue = JSON.stringify(updatedPasswords);

    if (Platform.OS === 'web') {
      //  console.log(Platform.OS)
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

// Funcion para rliminar una contraseña por su ID

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
