import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const ProfileScreen = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dni: user?.dni || "",
    email: user?.email || "",
    category: user?.category || "",
    level: user?.level || "",
    hand: user?.hand || "Derecha",
    position: user?.position || "Drive",
  });

  const pickImage = async (useCamera = false) => {
    try {
      const { status } = await (useCamera
        ? ImagePicker.requestCameraPermissionsAsync()
        : ImagePicker.requestMediaLibraryPermissionsAsync());

      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          `Necesitamos acceso a ${useCamera ? "la cámara" : "tus fotos"} para ${
            useCamera ? "tomar" : "seleccionar"
          } una imagen.`
        );
        return;
      }

      const result = await (useCamera
        ? ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          }));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert(
        "Error",
        "No se pudo seleccionar la imagen. Inténtalo de nuevo."
      );
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile({
        ...formData,
        profileImage: profileImage || undefined,
      });
      setIsEditing(false);
      Alert.alert("¡Éxito!", "Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error", error.message || "No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteType: "up" | "down") => {
    try {
      // Aquí implementaremos la lógica de votación
      Alert.alert(
        "Voto registrado",
        `Has votado que este jugador está ${
          voteType === "up" ? "por encima" : "por debajo"
        } de su categoría`
      );
    } catch (error) {
      console.error("Error al votar:", error);
      Alert.alert("Error", "No se pudo registrar tu voto");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // La navegación se manejará automáticamente por el AuthContext
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la información del usuario</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {isEditing && (
            <View style={styles.imageButtons}>
              <TouchableOpacity
                style={[styles.imageButton, { marginRight: 10 }]}
                onPress={() => pickImage(false)}
              >
                <Text style={styles.buttonText}>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => pickImage(true)}
              >
                <Text style={styles.buttonText}>Cámara</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user.firstName}</Text>
        <Text style={styles.category}>Categoría: {user.category}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Perfil</Text>

        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) =>
                  setFormData({ ...formData, username: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nivel</Text>
              <TextInput
                style={styles.input}
                value={formData.level}
                onChangeText={(text) =>
                  setFormData({ ...formData, level: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mano hábil</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.hand === "Derecha" && styles.radioButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, hand: "Derecha" })}
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      formData.hand === "Derecha" &&
                        styles.radioButtonTextSelected,
                    ]}
                  >
                    Derecha
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.hand === "Izquierda" && styles.radioButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, hand: "Izquierda" })
                  }
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      formData.hand === "Izquierda" &&
                        styles.radioButtonTextSelected,
                    ]}
                  >
                    Izquierda
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Posición</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.position === "Drive" && styles.radioButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, position: "Drive" })
                  }
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      formData.position === "Drive" &&
                        styles.radioButtonTextSelected,
                    ]}
                  >
                    Drive
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.position === "Reves" && styles.radioButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, position: "Reves" })
                  }
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      formData.position === "Reves" &&
                        styles.radioButtonTextSelected,
                    ]}
                  >
                    Revés
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nivel:</Text>
              <Text style={styles.infoText}>{user.level}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mano hábil:</Text>
              <Text style={styles.infoText}>{user.hand}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Posición:</Text>
              <Text style={styles.infoText}>{user.position}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Votación</Text>
        <Text style={styles.voteText}>
          ¿Este jugador está en la categoría correcta?
        </Text>
        <View style={styles.voteButtons}>
          <TouchableOpacity
            style={[styles.voteButton, styles.voteUp]}
            onPress={() => handleVote("up")}
          >
            <Text style={styles.voteButtonText}>↑ Ta pasado</Text>
          </TouchableOpacity>
          {/*
          <TouchableOpacity
            style={[styles.voteButton, styles.voteDown]}
            onPress={() => handleVote("down")}
          >
            <Text style={styles.voteButtonText}>↓ Está por debajo</Text>
          </TouchableOpacity>*/}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                setFormData({
                  username: user.username,
                  email: user.email,
                  category: user.category || "",
                  level: user.level || "",
                  hand: user.hand || "Derecha",
                  position: user.position || "Drive",
                });
                setProfileImage(user.profileImage || null);
              }}
            >
              <Text style={[styles.buttonText, { color: "#ff3b30" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 50,
    color: "#888",
    fontWeight: "bold",
  },
  imageButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 5,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    minWidth: 100,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  radioButtonText: {
    color: "#333",
  },
  radioButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    color: "#666",
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  voteText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
  voteButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  voteButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    minWidth: 150,
  },
  voteUp: {
    backgroundColor: "#4CAF50",
  },
  voteDown: {
    backgroundColor: "#f44336",
  },
  voteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    borderColor: "#ff3b30",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ProfileScreen;
