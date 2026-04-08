import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { getMe, TOKEN_KEY } from "../services/api";
import { User } from "../types/user";

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = "https://overformed-laverne-nondiffuse.ngrok-free.dev";

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const redirectUrl = Linking.createURL("auth/callback");
      const authUrl = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const token = parsed.queryParams?.token as string | undefined;

        if (!token) {
          Alert.alert("Error", "No se pudo obtener el token de autenticación.");
          return;
        }

        // 1. Guardar el token PRIMERO para que el interceptor de axios lo encuentre
        await AsyncStorage.setItem(TOKEN_KEY, token);

        // 2. Obtener los datos frescos del usuario
        const me = await getMe();

        // 3. Actualizar el contexto de autenticación
        await login(token, me);
      } else if (result.type === "cancel") {
        // El usuario cerró el browser — nada que hacer
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Hubo un problema al iniciar sesión. Intentá de nuevo.",
      );
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo & Branding */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🏓</Text>
        </View>
        <Text style={styles.title}>Padel UP</Text>
        <Text style={styles.subtitle}>Liga SAG — San Andrés de Giles</Text>
      </View>

      {/* Tagline */}
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>Tu liga de pádel,</Text>
        <Text style={styles.taglineAccent}>en un solo lugar.</Text>
      </View>

      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#0F1923" size="small" />
          ) : (
            <>
              <View style={styles.googleIconWrapper}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>
                Iniciar sesión con Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Al ingresar aceptás los términos de la Liga SAG
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Padel UP © 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 28,
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#00D9A620",
    top: -80,
    right: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#007AFF18",
    bottom: -50,
    left: -60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#1E2D3D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#00D9A6",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  logoEmoji: {
    fontSize: 52,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#00D9A6",
    fontWeight: "600",
    letterSpacing: 1.2,
    marginTop: 4,
    textTransform: "uppercase",
  },
  taglineContainer: {
    alignItems: "center",
  },
  tagline: {
    fontSize: 26,
    color: "#C9D4E0",
    fontWeight: "300",
    textAlign: "center",
  },
  taglineAccent: {
    fontSize: 26,
    color: "#00D9A6",
    fontWeight: "700",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: "#00D9A6",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  googleIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  googleButtonText: {
    color: "#0F1923",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  disclaimer: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  footer: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
});
