import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system';
import * as Papa from 'papaparse';
import { Alert, Platform } from 'react-native';

export const importFromCSV = async <T extends Record<string, any>>(): Promise<T[] | null> => {
  try {
    //abrir el selector de archivos para que el usuario elija un archivo CSV
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/comma-separated-values', 'text/csv'], // filtro para archivos CSV
      copyToCacheDirectory: true, // necesario en móvil para poder leer el archivo luego
    });

    //si el usuario cancela, salimos
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('Selección de archivo cancelada por el usuario');
      return null;
    }

    const selectedFile = result.assets[0];
    let csvText = '';

    //verificamos la plataforma
    if (Platform.OS === 'web') {
      // En Web el archivo viene dentro de un objeto File tipo Blob de JS estandar
      const fileBlob = selectedFile.file;
      if (!fileBlob) throw new Error('No se pudo acceder al archivo en entorno Web.');
      
      csvText = await fileBlob.text();
    } else {
      //en Android / iOS leemos la URI local usando expo-file-system
      csvText = await readAsStringAsync(selectedFile.uri, {
        encoding: 'utf8',
      });
    }

    //remover el BOM (Byte Order Mark) si existe (tu exportador añade `\ufeff`)
    if (csvText.startsWith('\ufeff')) {
      csvText = csvText.substring(1);
    }

    //parsear el string CSV a objetos de JS con PapaParse
    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,            // Convierte la primera fila en las llaves del objeto
        skipEmptyLines: true,     // Ignora líneas vacías al final del archivo
        dynamicTyping: true,      // Convierte automáticamente números y booleanos de string a sus tipos reales
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('Advertencias durante el parseo de CSV:', results.errors);
          }
          resolve(results.data);  // Retorna el array de objetos parseados
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });

  } catch (error) {
    console.error(error);
    const errorMsg = `Error al importar el archivo: ${error instanceof Error ? error.message : error}`;
    
    if (Platform.OS === 'web') {
      alert(errorMsg);
    } else {
      Alert.alert('Error', errorMsg);
    }
    return null;
  }
};