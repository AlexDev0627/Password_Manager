import * as Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import { writeAsStringAsync, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
// import { EncodingType } from 'node_modules/expo-file-system/build/legacy/FileSystem.types';

//funcion para exportar a csv, recibe un array de objetos y el nombre del archivo a exportar, si no se le pasa un nombre se le asigna "export" por defecto
export const exportToCSV = async <T extends Record<string, any>>(data: T[], baseFilename: string = 'export'): Promise<void> => {
    try {
        //verificar si el array de datos esta vacio, si es asi mostrar un mensaje de error y no intentar exportar
        if (data.length === 0) {

            if (Platform.OS === "web") {
                alert("Error al intentar exportar");
            } else {
                Alert.alert(`Error al exportar`);
            }
        }
        // formateamos el array de objtos en formato csv con la librerira papaparse
        const csv: string = Papa.unparse(data);
        //nombre del archivo que se va a exportar
        const fileName = `${baseFilename}_${Date.now()}.csv`;

        console.log(`Archivo exportado ${fileName} con contenido:\n${csv}`);
        //verificamos la plataforma, si es web hacemos esto:
        if (Platform.OS === 'web') {
        const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    return;
  }else{
    //si es adroid/Ios hacemos esto:
    const documentDir = Paths?.document?.uri;
    if (!documentDir) {
      throw new Error("La ruta del sistema de archivos no está disponible.");
    }
    const fileUri = `${documentDir}/${fileName}`;

    await writeAsStringAsync(fileUri, `\ufeff${csv}`, {
      encoding: 'utf8',
    });
    
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Guardar o enviar CSV',
        UTI: 'public.comma-separated-values-text' 
      });
    } else {
      Alert.alert("Guardado", `Archivo guardado en el dispositivo como: ${fileName}`);
    }
  }

} catch (error) {
  console.log("Error al exportar a CSV:", error);
  if (Platform.OS === "web") {
    alert("Error al intentar exportar");
  } else {
    Alert.alert(`Error al exportar`);
  }
}}