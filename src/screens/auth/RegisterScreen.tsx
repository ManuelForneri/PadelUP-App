// frontend/src/screens/auth/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../types/navigation";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

// Lista de ciudades disponibles
const cities = [
  "San Andrés de Giles",
  "Luján",
  "San Antonio de Areco",
  "Carmen de Areco",
  "Mercedes",
  "Suipacha",
  "Chivilcoy",
  "Chacabuco",
  // Agrega más ciudades según sea necesario
];

const registerSchema = Yup.object().shape({
  dni: Yup.string()
    .required("DNI es requerido")
    .matches(/^\d{7,8}$/, "DNI inválido (7 u 8 dígitos)"),
  firstName: Yup.string()
    .required("Nombre es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  lastName: Yup.string()
    .required("Apellido es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  city: Yup.string().required("Ciudad es requerida"),
  email: Yup.string()
    .email("Email inválido")
    .required("Email es requerido"),
  password: Yup.string()
    .required("Contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Confirma tu contraseña"),
  category: Yup.string().required("Categoría es requerida"),
  level: Yup.string().required("Nivel es requerido"),
  hand: Yup.string().required("Mano hábil es requerida"),
  position: Yup.string().required("Posición es requerida"),
});

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    try {
      // Verificar permisos en iOS
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a tu galería para seleccionar una imagen de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
        exif: false,
      });

      if (result.canceled) {
        console.log("Selección de imagen cancelada por el usuario");
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        throw new Error("No se pudo cargar la imagen seleccionada");
      }

      const selectedAsset = result.assets[0];

      // Validar tamaño de la imagen (opcional, máximo 5MB)
      if (selectedAsset.fileSize && selectedAsset.fileSize > 5 * 1024 * 1024) {
        throw new Error(
          "La imagen es demasiado grande. El tamaño máximo permitido es de 5MB."
        );
      }

      console.log("Imagen seleccionada:", {
        uri: selectedAsset.uri,
        type: selectedAsset.type,
        width: selectedAsset.width,
        height: selectedAsset.height,
        fileSize: selectedAsset.fileSize
          ? `${Math.round(selectedAsset.fileSize / 1024)}KB`
          : "desconocido",
      });

      setProfileImage(selectedAsset.uri);
    } catch (error: any) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert(
        "Error",
        error.message ||
          "No se pudo seleccionar la imagen. Por favor, intenta de nuevo."
      );
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (values: any) => {
    if (isSubmitting) return; // Evitar múltiples envíos

    setIsSubmitting(true);

    console.log("Intentando registrar con valores:", {
      ...values,
      profileImage: profileImage ? "Imagen seleccionada" : "Sin imagen",
    });

    try {
      const userData = {
        ...values,
        profileImage,
      };

      console.log("Enviando datos de registro...");
      const response = await register(userData);

      console.log("Registro exitoso:", response);

      // Mostrar mensaje de éxito
      Alert.alert(
        "¡Registro exitoso!",
        "Tu cuenta ha sido creada correctamente. Serás redirigido al inicio.",
        [{ text: "Aceptar" }]
      );
    } catch (error: any) {
      console.error("Error en el registro:", error);

      // Mostrar mensaje de error detallado
      Alert.alert(
        "Error al registrarse",
        error.message ||
          "Ocurrió un error al intentar registrarse. Por favor, inténtalo de nuevo.",
        [{ text: "Aceptar" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <Formik
          initialValues={{
            dni: "",
            firstName: "",
            lastName: "",
            city: "",
            email: "",
            password: "",
            repeatPassword: "",
            category: "3ra",
            level: "Medio",
            hand: "Derecha",
            position: "Drive",
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Selector de imagen de perfil */}
              <View style={styles.imageUploadContainer}>
                <TouchableOpacity
                  style={[
                    styles.imagePicker,
                    isSubmitting && styles.disabledButton,
                  ]}
                  onPress={handleImagePick}
                  disabled={isSubmitting}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePickerText}>+</Text>
                      <Text style={styles.imagePickerSubtext}>
                        Foto de perfil
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {profileImage && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setProfileImage(null)}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Campos de información personal */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>DNI *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.dni && errors.dni && styles.inputError,
                  ]}
                  placeholder="12345678"
                  onChangeText={handleChange("dni")}
                  onBlur={handleBlur("dni")}
                  value={values.dni}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
                {touched.dni && errors.dni && (
                  <Text style={styles.errorText}>{errors.dni}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Nombre *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.firstName && errors.firstName && styles.inputError,
                    ]}
                    placeholder="Juan"
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                    editable={!isSubmitting}
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Apellido *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.lastName && errors.lastName && styles.inputError,
                    ]}
                    placeholder="Pérez"
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    editable={!isSubmitting}
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ciudad *</Text>
                <View style={[
                  styles.pickerContainer,
                  touched.city && errors.city && styles.inputError
                ]}>
                  <Picker
                    selectedValue={values.city}
                    onValueChange={handleChange("city")}
                    style={styles.picker}
                    enabled={!isSubmitting}
                  >
                    <Picker.Item label="Selecciona una ciudad" value="" />
                    {cities.map((city) => (
                      <Picker.Item key={city} label={city} value={city} />
                    ))}
                  </Picker>
                </View>
                {touched.city && errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              <TextInput
                style={[
                  styles.input,
                  errors.email && touched.email && styles.inputError,
                ]}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  errors.password && touched.password && styles.inputError,
                ]}
                placeholder="Contraseña"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  errors.repeatPassword &&
                    touched.repeatPassword &&
                    styles.inputError,
                ]}
                placeholder="Repetir contraseña"
                secureTextEntry
                onChangeText={handleChange("repeatPassword")}
                onBlur={handleBlur("repeatPassword")}
                value={values.repeatPassword}
              />
              {errors.repeatPassword && touched.repeatPassword && (
                <Text style={styles.errorText}>{errors.repeatPassword}</Text>
              )}

              {/* Selectores */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Categoría:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.category}
                    onValueChange={handleChange("category")}
                    style={styles.picker}
                  >
                    <Picker.Item label="1ra" value="1ra" />
                    <Picker.Item label="2da" value="2da" />
                    <Picker.Item label="3ra" value="3ra" />
                    <Picker.Item label="4ta" value="4ta" />
                    <Picker.Item label="5ta" value="5ta" />
                    <Picker.Item label="6ta" value="6ta" />
                    <Picker.Item label="7ma" value="7ma" />
                    <Picker.Item label="8va" value="8va" />
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Nivel:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.level}
                    onValueChange={handleChange("level")}
                    style={styles.picker}
                  >
                    <Picker.Item label="Inicial" value="Inicial" />
                    <Picker.Item label="Medio" value="Medio" />
                    <Picker.Item label="Avanzado" value="Avanzado" />
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Mano hábil:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.hand}
                    onValueChange={handleChange("hand")}
                    style={styles.picker}
                  >
                    <Picker.Item label="Derecha" value="Derecha" />
                    <Picker.Item label="Izquierda" value="Izquierda" />
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Posición:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.position}
                    onValueChange={handleChange("position")}
                    style={styles.picker}
                  >
                    <Picker.Item label="Drive" value="Drive" />
                    <Picker.Item label="Reves" value="Reves" />
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Registrarse</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  // Estilos para la subida de imagen
  imageUploadContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  removeImageButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#ff4444",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  removeImageText: {
    color: "white",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "bold",
    marginTop: -2,
  },
  // Estilos para los campos del formulario
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  // picker style is already defined above
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#A0C4FF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
});

export default RegisterScreen;
