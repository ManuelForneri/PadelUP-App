// frontend/src/screens/home/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
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
      <Text style={styles.subtitle}>Tu perfil de PadelSAG</Text>

      {user?.profileImage ? (
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.profileImage,
            {
              backgroundColor: "#e1e1e1",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{ fontSize: 50, color: "#888" }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.userInfo}>
        <Text style={styles.sectionTitle}>Información del Perfil</Text>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>
            {user?.email || "No especificado"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={styles.infoLabel}>Categoría:</Text>
            <Text style={styles.infoText}>
              {user?.category || "No especificada"}
            </Text>
          </View>
          <View style={{ width: "48%" }}>
            <Text style={styles.infoLabel}>Nivel:</Text>
            <Text style={styles.infoText}>
              {user?.level || "No especificado"}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <View style={{ width: "48%" }}>
            <Text style={styles.infoLabel}>Mano hábil:</Text>
            <Text style={styles.infoText}>
              {user?.hand || "No especificada"}
            </Text>
          </View>
          <View style={{ width: "48%" }}>
            <Text style={styles.infoLabel}>Posición:</Text>
            <Text style={styles.infoText}>
              {user?.position || "No especificada"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#007AFF",
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
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007AFF",
    textAlign: "center",
  },
});

export default HomeScreen;
