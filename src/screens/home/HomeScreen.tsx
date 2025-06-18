// frontend/src/screens/home/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

const HomeScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido {user?.username}!</Text>
      <Text style={styles.subtitle}>Has iniciado sesión correctamente</Text>

      <View style={styles.userInfo}>
        <Text style={styles.infoText}>Email: {user?.email}</Text>
        <Text style={styles.infoText}>Categoría: {user?.category}</Text>
        <Text style={styles.infoText}>Nivel: {user?.level}</Text>
        <Text style={styles.infoText}>Mano hábil: {user?.hand}</Text>
        <Text style={styles.infoText}>Posición: {user?.position}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  userInfo: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
