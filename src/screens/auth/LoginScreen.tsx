import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { RootStackParamList } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";
// Paleta de colores

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const loginSchema = Yup.object().shape({
  dniOrEmail: Yup.string().required("DNI o email es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const handleLogin = async (values: {
    dniOrEmail: string;
    password: string;
  }) => {
    try {
      console.log("Iniciando sesión con:", values.dniOrEmail);
      await login(values.dniOrEmail, values.password);
      console.log("Inicio de sesión exitoso");
    } catch (error: any) {
      console.error("Error en handleLogin:", {
        message: error.message,
        response: error.response?.data,
        code: error.code,
        stack: error.stack,
      });

      let errorMessage = error.message || "Error al iniciar sesión";

      // Manejar errores específicos
      if (error.response) {
        // El servidor respondió con un error
        if (error.response.status === 401) {
          errorMessage =
            "Credenciales incorrectas. Por favor, verifica tus datos.";
        } else if (error.response.status >= 500) {
          errorMessage =
            "Error en el servidor. Por favor, inténtalo más tarde.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message === "Network Error") {
        errorMessage =
          "No se pudo conectar al servidor. Verifica tu conexión a Internet.";
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
          </View>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
        </View>

        <Formik
          initialValues={{ dniOrEmail: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
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
              {/* Campo de DNI/Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>DNI o Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.dniOrEmail &&
                      touched.dniOrEmail &&
                      styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu DNI o email"
                    placeholderTextColor={COLORS.gray}
                    value={values.dniOrEmail}
                    onChangeText={handleChange("dniOrEmail")}
                    onBlur={handleBlur("dniOrEmail")}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
                {errors.dniOrEmail && touched.dniOrEmail && (
                  <Text style={styles.errorText}>{errors.dniOrEmail}</Text>
                )}
              </View>

              {/* Campo de Contraseña */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password && touched.password && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={!isPasswordVisible}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={
                        isPasswordVisible ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={COLORS.gray}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => {}} // TODO: Implementar recuperación de contraseña
                >
                  <Text style={styles.forgotPasswordText}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botón de Iniciar Sesión */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.primary} size="small" />
                ) : (
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.divider} />
              </View>

              {/* Botón de Registro */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                  disabled={isLoading}
                >
                  <Text style={styles.registerLink}>Regístrate</Text>
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
    backgroundColor: COLORS.backgroundPrimary,
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
    fontWeight: "500",
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
    height: "100%",
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingLeft: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 5,
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
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: `${COLORS.primary}80`, // 50% opacity
    shadowOpacity: 0,
  },
  buttonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
    textShadowColor: COLORS.gray,
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: COLORS.gray,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: COLORS.gray,
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
});

export default LoginScreen;
