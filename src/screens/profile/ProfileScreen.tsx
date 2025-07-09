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
  Dimensions,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

// Constantes para los selectores
const CATEGORIAS = ["8va", "7ma", "6ta", "5ta", "4ta", "3ra", "2da", "1ra"];

const NIVELES = ["Inicial", "Medio", "Avanzado"];

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

  const getSkillLevel = (level: string) => {
    switch (level?.toLowerCase()) {
      case "inicial":
        return "Principiante";
      case "medio":
        return "Intermedio";
      case "avanzado":
        return "Avanzado";
      case "fuerte":
        return "Fuerte";
      default:
        return level || "No especificado";
    }
  };

  const getPositionIcon = (position: string) => {
    return position === "Drive" ? "tennis-ball" : "tennis";
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={() => pickImage(false)}
                >
                  <Ionicons name="images" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={() => pickImage(true)}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <MaterialIcons name="category" size={16} color="#fff" />
                <Text style={styles.statText}>
                  {user.category || "Sin categoría"}
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="location-on" size={16} color="#fff" />
                <Text style={styles.statText}>
                  {user.city || "Sin ubicación"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Perfil</Text>

        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                placeholder="Tu nombre completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(itemValue) =>
                    setFormData({ ...formData, category: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona una categoría" value="" />
                  {CATEGORIAS.map((categoria) => (
                    <Picker.Item
                      key={categoria}
                      label={categoria}
                      value={categoria}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nivel</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.level}
                  onValueChange={(itemValue) =>
                    setFormData({ ...formData, level: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona un nivel" value="" />
                  {NIVELES.map((nivel) => (
                    <Picker.Item key={nivel} label={nivel} value={nivel} />
                  ))}
                </Picker>
              </View>
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
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail" size={20} color="#4c669f" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text
                  style={styles.infoText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.email}
                </Text>
              </View>
            </View>

            <View style={[styles.infoCard, styles.skillCard]}>
              <View style={[styles.infoIcon, { backgroundColor: "#e3f2fd" }]}>
                <MaterialIcons name="emoji-events" size={20} color="#4c669f" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nivel de Juego</Text>
                <Text style={styles.infoText}>{getSkillLevel(user.level)}</Text>
                <View style={styles.skillLevel}>
                  <View
                    style={[
                      styles.skillBar,
                      {
                        width:
                          user.level === "inicial"
                            ? "33%"
                            : user.level === "medio"
                            ? "66%"
                            : "100%",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoCard, styles.infoCardHalf]}>
                <View style={[styles.infoIcon, { backgroundColor: "#e8f5e9" }]}>
                  <MaterialCommunityIcons
                    name="hand-back-left"
                    size={20}
                    color="#4c669f"
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mano Hábil</Text>
                  <Text style={styles.infoText}>
                    {user.hand || "No especificado"}
                  </Text>
                </View>
              </View>

              <View style={[styles.infoCard, styles.infoCardHalf]}>
                <View style={[styles.infoIcon, { backgroundColor: "#e8f5e9" }]}>
                  <MaterialCommunityIcons
                    name={getPositionIcon(user.position)}
                    size={20}
                    color="#4c669f"
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Posición</Text>
                  <Text style={styles.infoText}>
                    {user.position === "Drive"
                      ? "Drive"
                      : user.position === "Reves"
                      ? "Revés"
                      : "No especificada"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      {user?.id !== user?.id && (
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
          </View>
        </View>
      )}
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
                  firstName: user.firstName,
                  lastName: user.lastName,
                  dni: user.dni,
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
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5c6bc0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  userStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
    width: "100%",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    margin: 3,
    maxWidth: "45%",
  },
  statText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "600",
  },
  imageButtons: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 3,
  },
  imageButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },
  skillCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#5c6bc0",
  },
  skillLevel: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  skillBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: -5,
  },
  infoCardHalf: {
    width: "48%",
    marginBottom: 10,
    marginHorizontal: 0,
  },
  category: {
    fontSize: 16,
    color: "#666",
  },
  infoContainer: {
    paddingHorizontal: 15,
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
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 4,
  },
  picker: {
    width: "100%",
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
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    minWidth: 120,
  },
  editButton: {
    backgroundColor: "#4c669f",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProfileScreen;
