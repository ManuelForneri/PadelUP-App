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
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Touchable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../theme/colors";
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
  email: Yup.string().email("Email inválido").required("Email es requerido"),
  password: Yup.string()
    .required("Contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Confirma tu contraseña"),
  gender: Yup.string()
    .required("Género es requerido")
    .oneOf(["masculino", "femenino", "otro"], "Género inválido"),
  category: Yup.string()
    .required("Categoría es requerida")
    .oneOf(
      ["8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"],
      "Categoría inválida"
    ),
  nivel: Yup.string()
    .required("Nivel es requerido")
    .oneOf(["inicial", "medio", "fuerte"], "Nivel inválido"),
  hand: Yup.string()
    .required("Mano hábil es requerida")
    .oneOf(["Derecha", "Izquierda"], "Opción inválida"),
  position: Yup.string()
    .required("Posición es requerida")
    .oneOf(["Reves", "Drive", "Ambos"], "Posición inválida"),
});

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleImagePick = async () => {
    try {
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
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (result.canceled) return;
      if (!result.assets || result.assets.length === 0) {
        throw new Error("No se pudo cargar la imagen seleccionada");
      }

      const selectedAsset = result.assets[0];
      if (selectedAsset.fileSize && selectedAsset.fileSize > 5 * 1024 * 1024) {
        throw new Error(
          "La imagen es demasiado grande. El tamaño máximo permitido es de 5MB."
        );
      }

      setProfileImage(selectedAsset.uri);
    } catch (error: any) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert(
        "Error",
        error.message || "No se pudo seleccionar la imagen. Intenta de nuevo."
      );
    }
  };

  const handleRegister = async (values: any) => {
    try {
      console.log("Iniciando proceso de registro...");

      // Validar que las contraseñas coincidan
      if (values.password !== values.repeatPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }

      // Validar que se haya seleccionado un género
      if (!values.gender) {
        Alert.alert("Error", "Por favor selecciona un género");
        return;
      }

      // Validar que se haya seleccionado una categoría
      if (!values.category) {
        Alert.alert("Error", "Por favor selecciona una categoría");
        return;
      }

      setIsLoading(true);

      // Crear un objeto con los datos del usuario
      const userData = {
        dni: values.dni,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(),
        password: values.password,
        city: values.city,
        gender: values.gender,
        category: values.category,
        nivel: values.nivel,
        hand: values.hand,
        position: values.position,
        profileImage: profileImage || "",
        votes: {
          upVotes: 0,
          downVotes: 0,
          totalVotes: 0,
          voters: [],
        },
        points: 0,
      };

      console.log("Datos del usuario a registrar:", {
        ...userData,
        password: "***", // No registrar la contraseña real
        profileImage: profileImage ? "Imagen proporcionada" : "Sin imagen",
      });

      console.log("Enviando datos de registro al servidor...");

      try {
        const response = await register(userData);
        console.log("Registro exitoso:", response);

        // Mostrar mensaje de éxito
        Alert.alert(
          "¡Registro exitoso!",
          "Tu cuenta ha sido creada correctamente. Serás redirigido al inicio."
        );

        // El AuthProvider manejará la redirección automáticamente
      } catch (apiError: any) {
        console.error("Error en la API:", apiError);

        // Mostrar mensaje de error más descriptivo
        const errorMessage =
          apiError.response?.data?.message ||
          apiError.message ||
          "Ocurrió un error al procesar tu registro. Por favor, inténtalo de nuevo.";

        Alert.alert("Error en el registro", errorMessage);

        // Relanzar el error para que pueda ser manejado por el bloque catch externo si es necesario
        throw apiError;
      }
    } catch (error: any) {
      console.error("Error en el proceso de registro:", error);

      // No mostrar alerta aquí si ya se mostró en el bloque interno
      if (!error.handled) {
        Alert.alert(
          "Error",
          "Ocurrió un error al procesar tu registro. Por favor, verifica los datos e inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundLight}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="tennisball" size={60} color={COLORS.primary} />
            <Text style={styles.appName}>Padel UP</Text>
          </View>
          <Text style={styles.subtitle}>Crea tu cuenta</Text>
        </View>

        <Formik
          initialValues={{
            dni: "",
            firstName: "",
            lastName: "",
            city: "",
            email: "",
            password: "",
            repeatPassword: "",
            gender: "",
            category: "8va", // Valor por defecto: 8va categoría
            nivel: "medio", // Valor por defecto: nivel medio
            hand: "Derecha",
            position: "Ambos",
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
                  style={styles.imagePicker}
                  onPress={handleImagePick}
                  disabled={isLoading}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="camera" size={32} color={COLORS.gray} />
                      <Text style={styles.imagePickerSubtext}>
                        Agregar foto de perfil
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {profileImage && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setProfileImage(null)}
                    disabled={isLoading}
                  >
                    <Ionicons name="close" size={20} color={COLORS.textLight} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Campos del formulario */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>DNI *</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    touched.dni && errors.dni && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="card"
                    size={20}
                    color={COLORS.gray}
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="12345678"
                    placeholderTextColor={COLORS.gray}
                    onChangeText={handleChange("dni")}
                    onBlur={handleBlur("dni")}
                    value={values.dni}
                    keyboardType="numeric"
                    editable={!isLoading}
                  />
                </View>
                {touched.dni && errors.dni && (
                  <Text style={styles.errorText}>{errors.dni}</Text>
                )}
              </View>

              <View style={styles.column}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}
                >
                  <Text style={styles.label}>Nombre *</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.firstName &&
                        errors.firstName &&
                        styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={20}
                      color={COLORS.gray}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Juan"
                      placeholderTextColor={COLORS.gray}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      value={values.firstName}
                      editable={!isLoading}
                    />
                  </View>
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Apellido *</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.lastName && errors.lastName && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={20}
                      color={COLORS.gray}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Pérez"
                      placeholderTextColor={COLORS.gray}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      value={values.lastName}
                      editable={!isLoading}
                    />
                  </View>
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    touched.email && errors.email && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="mail"
                    size={20}
                    color={COLORS.gray}
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="ejemplo@email.com"
                    placeholderTextColor={COLORS.gray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    editable={!isLoading}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.column}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}
                >
                  <Text style={styles.label}>Contraseña *</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.password && errors.password && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={COLORS.gray}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.gray}
                      secureTextEntry={!isPasswordVisible}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.passwordToggle}
                    >
                      <Ionicons
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={20}
                        color={COLORS.gray}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Repetir Contraseña *</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.repeatPassword &&
                        errors.repeatPassword &&
                        styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={COLORS.gray}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.gray}
                      secureTextEntry={!isConfirmPasswordVisible}
                      onChangeText={handleChange("repeatPassword")}
                      onBlur={handleBlur("repeatPassword")}
                      value={values.repeatPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      onPress={toggleConfirmPasswordVisibility}
                      style={styles.passwordToggle}
                    >
                      <Ionicons
                        name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                        size={20}
                        color={COLORS.gray}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.repeatPassword && errors.repeatPassword && (
                    <Text style={styles.errorText}>
                      {errors.repeatPassword}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ciudad *</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    touched.city && errors.city && styles.inputError,
                  ]}
                >
                  <View style={styles.pickerWrapper}>
                    <Ionicons
                      name="location"
                      size={20}
                      color={COLORS.gray}
                      style={styles.pickerIcon}
                    />
                    <Picker
                      selectedValue={values.city}
                      onValueChange={handleChange("city")}
                      style={styles.picker}
                      dropdownIconColor={COLORS.gray}
                      enabled={!isLoading}
                    >
                      <Picker.Item label="Selecciona una ciudad" value="" />
                      {cities.map((city) => (
                        <Picker.Item key={city} label={city} value={city} />
                      ))}
                    </Picker>
                  </View>
                </View>
                {touched.city && errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              <View style={styles.column}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}
                >
                  <Text style={styles.label}>Género *</Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      touched.gender && errors.gender && styles.inputError,
                    ]}
                  >
                    <View style={styles.pickerWrapper}>
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.gray}
                        style={styles.pickerIcon}
                      />
                      <Picker
                        selectedValue={values.gender}
                        onValueChange={handleChange("gender")}
                        style={styles.picker}
                        dropdownIconColor={COLORS.gray}
                        enabled={!isLoading}
                      >
                        <Picker.Item label="Seleccione un género" value="" />
                        <Picker.Item label="Masculino" value="masculino" />
                        <Picker.Item label="Femenino" value="femenino" />
                        <Picker.Item label="Otro" value="otro" />
                      </Picker>
                    </View>
                  </View>
                  {touched.gender && errors.gender && (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  )}
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Categoría *</Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      touched.category && errors.category && styles.inputError,
                    ]}
                  >
                    <View style={styles.pickerWrapper}>
                      <Ionicons
                        name="trophy"
                        size={20}
                        color={COLORS.gray}
                        style={styles.pickerIcon}
                      />
                      <Picker
                        selectedValue={values.category}
                        onValueChange={handleChange("category")}
                        style={styles.picker}
                        dropdownIconColor={COLORS.gray}
                        enabled={!isLoading}
                      >
                        <Picker.Item
                          label="Selecciona una categoría"
                          value=""
                        />
                        <Picker.Item label="8va" value="8va" />
                        <Picker.Item label="7ma" value="7ma" />
                        <Picker.Item label="6ta" value="6ta" />
                        <Picker.Item label="5ta" value="5ta" />
                        <Picker.Item label="4ta" value="4ta" />
                        <Picker.Item label="3ra" value="3ra" />
                        <Picker.Item label="2da" value="2da" />
                        <Picker.Item label="1ra" value="1ra" />
                      </Picker>
                    </View>
                  </View>
                  {touched.category && errors.category && (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  )}
                </View>
              </View>

              <View style={styles.column}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}
                >
                  <Text style={styles.label}>Nivel *</Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      touched.nivel && errors.nivel && styles.inputError,
                    ]}
                  >
                    <View style={styles.pickerWrapper}>
                      <Ionicons
                        name="speedometer"
                        size={20}
                        color={COLORS.gray}
                        style={styles.pickerIcon}
                      />
                      <Picker
                        selectedValue={values.nivel}
                        onValueChange={handleChange("nivel")}
                        style={styles.picker}
                        dropdownIconColor={COLORS.gray}
                        enabled={!isLoading}
                      >
                        <Picker.Item label="Selecciona un nivel" value="" />
                        <Picker.Item label="Inicial" value="inicial" />
                        <Picker.Item label="Medio" value="medio" />
                        <Picker.Item label="Fuerte" value="fuerte" />
                      </Picker>
                    </View>
                  </View>
                  {touched.nivel && errors.nivel && (
                    <Text style={styles.errorText}>{errors.nivel}</Text>
                  )}
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]} />
              </View>

              <View style={styles.column}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}
                >
                  <Text style={styles.label}>Mano hábil *</Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      touched.hand && errors.hand && styles.inputError,
                    ]}
                  >
                    <View style={styles.pickerWrapper}>
                      <Ionicons
                        name="hand-right"
                        size={20}
                        color={COLORS.gray}
                        style={styles.pickerIcon}
                      />
                      <Picker
                        selectedValue={values.hand}
                        onValueChange={handleChange("hand")}
                        style={styles.picker}
                        dropdownIconColor={COLORS.gray}
                        enabled={!isLoading}
                      >
                        <Picker.Item label="Derecha" value="Derecha" />
                        <Picker.Item label="Izquierda" value="Izquierda" />
                      </Picker>
                    </View>
                  </View>
                  {touched.hand && errors.hand && (
                    <Text style={styles.errorText}>{errors.hand}</Text>
                  )}
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.label}>Posición *</Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      touched.position && errors.position && styles.inputError,
                    ]}
                  >
                    <View style={styles.pickerWrapper}>
                      <Ionicons
                        name="tennisball"
                        size={20}
                        color={COLORS.gray}
                        style={styles.pickerIcon}
                      />
                      <Picker
                        selectedValue={values.position}
                        onValueChange={handleChange("position")}
                        style={styles.picker}
                        dropdownIconColor={COLORS.gray}
                        enabled={!isLoading}
                      >
                        <Picker.Item label="Revés" value="Reves" />
                        <Picker.Item label="Drive" value="Drive" />
                        <Picker.Item label="Ambos lados" value="Ambos" />
                      </Picker>
                    </View>
                  </View>
                  {touched.position && errors.position && (
                    <Text style={styles.errorText}>{errors.position}</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  (isLoading ||
                    !values.dni ||
                    !values.firstName ||
                    !values.lastName ||
                    !values.email ||
                    !values.password ||
                    !values.repeatPassword ||
                    !values.city ||
                    !values.gender ||
                    !values.category) &&
                    styles.buttonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={
                  isLoading ||
                  !values.dni ||
                  !values.firstName ||
                  !values.lastName ||
                  !values.email ||
                  !values.password ||
                  !values.repeatPassword ||
                  !values.city ||
                  !values.gender ||
                  !values.category
                }
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.textLight} />
                ) : (
                  <Text style={styles.buttonText}>Registrarse</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  disabled={isLoading}
                >
                  <Text style={styles.loginLink}>Inicia sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  // Estilos para la subida de imagen
  imageUploadContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  imagePickerText: {
    fontSize: 24,
    color: COLORS.gray,
    fontWeight: "bold",
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
    textAlign: "center",
  },
  removeImageButton: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: COLORS.error,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  removeImageText: {
    color: COLORS.textLight,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "bold",
  },
  // Estilos para los campos del formulario
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 8,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.textDark,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    color: COLORS.gray,
  },
  passwordToggle: {
    padding: 10,
  },
  // Estilos para los selectores
  pickerContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
    overflow: "hidden",
  },
  picker: {
    flex: 1,
    height: 50,
    color: COLORS.textDark,
    marginLeft: 5,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  pickerIcon: {
    marginRight: 5,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  // Estilos para el botón
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: `${COLORS.primary}80`,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  // Estilos para el contenedor de inicio de sesión
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  loginText: {
    color: COLORS.textDark,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;
