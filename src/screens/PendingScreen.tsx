import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function PendingScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  }, [refreshUser]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom + 24, 40) },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#00D9A6"
          colors={["#00D9A6"]}
        />
      }
    >
      {/* Decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Illustration */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⏳</Text>
      </View>

      {/* Content */}
      <Text style={styles.title}>¡Perfil en revisión!</Text>
      <Text style={styles.subtitle}>
        Hola <Text style={styles.name}>{user?.first_name}</Text>, tu perfil fue
        enviado correctamente.
      </Text>

      {/* Status card */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            Esperando asignación de categoría
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          Un administrador de la Liga SAG revisará tu solicitud y te asignará
          una categoría. Una vez aprobado, podrás acceder a la app completa.
        </Text>
      </View>

      {/* Info items */}
      <View style={styles.infoContainer}>
        {[
          { emoji: "📋", text: "Tu perfil fue guardado exitosamente" },
          {
            emoji: "🏓",
            text: "El admin asignará tu categoría según tu nivel",
          },
          {
            emoji: "🔔",
            text: "Revisá esta pantalla o esperá el contacto del admin",
          },
        ].map((item, i) => (
          <View key={i} style={styles.infoItem}>
            <Text style={styles.infoEmoji}>{item.emoji}</Text>
            <Text style={styles.infoText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Refresh tip */}
      <Text style={styles.refreshTip}>↓ Deslizá para actualizar tu estado</Text>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#00D9A615",
    top: -60,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#007AFF10",
    bottom: 40,
    left: -50,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 35,
    backgroundColor: "#1E2D3D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#2D3F50",
    shadowColor: "#00D9A6",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  icon: {
    fontSize: 35,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  name: {
    color: "#00D9A6",
    fontWeight: "700",
  },
  card: {
    width: "100%",
    backgroundColor: "#1E2D3D",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#00D9A640",
    marginBottom: 24,
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  statusText: {
    color: "#F59E0B",
    fontWeight: "700",
    fontSize: 12,
    flex: 1,
  },
  cardDescription: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 22,
  },
  infoContainer: {
    width: "100%",
    gap: 14,
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  infoEmoji: {
    fontSize: 18,
    marginTop: 1,
  },
  infoText: {
    color: "#D1D5DB",
    fontSize: 12,
    lineHeight: 22,
    flex: 1,
  },
  refreshTip: {
    color: "#374151",
    fontSize: 11,
    marginBottom: 28,
  },
  logoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  logoutText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 15,
  },
});
