import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const pickImage = async (
  options: ImagePicker.ImagePickerOptions = {}
) => {
  // Solicitar permisos para la galería
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permiso denegado",
      "Necesitamos permiso para acceder a tus fotos para que puedas seleccionar una imagen de perfil.",
      [{ text: "OK" }]
    );
    return null;
  }

  // Configuración por defecto
  const defaultOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: false,
    ...options,
  };

  // Abrir el selector de imágenes
  const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  }

  return null;
};

export const takePhoto = async (
  options: ImagePicker.ImagePickerOptions = {}
) => {
  // Solicitar permisos para la cámara
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permiso denegado",
      "Necesitamos permiso para acceder a tu cámara para que puedas tomar una foto de perfil.",
      [{ text: "OK" }]
    );
    return null;
  }

  // Configuración por defecto
  const defaultOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: false,
    ...options,
  };

  // Abrir la cámara
  const result = await ImagePicker.launchCameraAsync(defaultOptions);

  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  }

  return null;
};

export const getImageSource = (uri: string | null | undefined) => {
  if (!uri) return null;

  // Si la URI es una ruta local o una URL web
  if (uri.startsWith("file:") || uri.startsWith("http")) {
    return { uri };
  }

  // Si es un nombre de recurso local (opcional)
  // return require(`../assets/images/${uri}`);

  return null;
};
