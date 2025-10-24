import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Formik } from "formik";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

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
            <Text style={styles.appName}>PADEL UP</Text>
          </View>
          <Image
            source={require("../../assets/images/logo-padelUP.jpg")}
            style={styles.logo}
          />
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
                    color={COLORS.neutral[500]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu DNI o email"
                    placeholderTextColor={COLORS.neutral[400]}
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
                    color={COLORS.neutral[500]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={COLORS.neutral[400]}
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
                      color={COLORS.neutral[500]}
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
                style={styles.button}
                onPress={() => handleSubmit()}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.neutral[0]} size="small" />
                ) : (
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <View style={styles.dividerDot} />
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
    paddingHorizontal: 24,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    color: "white",
    marginTop: 20,
    fontFamily: "Adoriademo",
    textShadowColor: COLORS.green[700],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.neutral[600],
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: COLORS.neutral[900],
    marginBottom: 10,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[0],
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    shadowColor: COLORS.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: "100%",
    color: COLORS.neutral[900],
    fontSize: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 6,
  },
  inputError: {
    borderColor: COLORS.status.error,
  },
  errorText: {
    color: COLORS.status.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: COLORS.green[600],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: COLORS.green[300],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: `${COLORS.primary}80`,
    shadowOpacity: 0,
  },
  buttonText: {
    color: COLORS.neutral[0],
    fontSize: 16,
    fontWeight: "700",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  forgotPasswordText: {
    color: COLORS.green[600],
    fontSize: 13,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[300],
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green[700],
    marginHorizontal: 12,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  registerText: {
    color: COLORS.neutral[500],
    fontSize: 13,
  },
  registerLink: {
    color: COLORS.green[600],
    fontSize: 13,
    fontWeight: "700",
  },
});

export default LoginScreen;
