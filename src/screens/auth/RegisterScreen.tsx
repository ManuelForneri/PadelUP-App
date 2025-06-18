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

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required("Nombre de usuario es requerido")
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres"),
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const handleRegister = async (values: any) => {
    console.log('Intentando registrar con valores:', { ...values, profileImage });
    try {
      const response = await register({
        ...values,
        profileImage,
      });
      
      console.log('Registro exitoso:', response);
      
      // Navegar a la pantalla principal después de un registro exitoso
      // La navegación ahora se maneja en el AuthContext cuando se actualiza el estado del usuario
    } catch (error: any) {
      console.error('Error en el registro:', error);
      console.error('Detalles del error:', JSON.stringify(error, null, 2));
      
      let errorMessage = "Error al registrarse. Por favor, inténtalo de nuevo.";
      
      if (error.response) {
        // Error de respuesta del servidor
        console.error('Datos de la respuesta de error:', error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error('No se recibió respuesta del servidor');
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a Internet.";
      } else {
        // Error al configurar la petición
        console.error('Error al configurar la petición:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <Formik
          initialValues={{
            username: "",
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
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleImagePick}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.imagePickerText}>+ Foto de perfil</Text>
                )}
              </TouchableOpacity>

              {/* Campos del formulario */}
              <TextInput
                style={[
                  styles.input,
                  errors.username && touched.username && styles.inputError,
                ]}
                placeholder="Nombre de usuario"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
              {errors.username && touched.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

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
                  errors.repeatPassword && touched.repeatPassword && styles.inputError,
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
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
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
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePickerText: {
    color: "#666",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
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
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: "#555",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#fff",
  },
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
