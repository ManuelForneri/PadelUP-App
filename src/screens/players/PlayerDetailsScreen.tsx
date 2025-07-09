import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import playerService from "../../services/api/player.service";
import { Player } from "../../../types";

const COLORS = {
  primary: "#FF5A5F", // Rojo coral
  secondary: "#00A699", // Verde agua
  dark: "#2D3436", // Gris oscuro
  light: "#F7F9F9", // Gris muy claro
  white: "#FFFFFF",
  gray: "#A4A4A4",
  error: "#E74C3C",
};

type Props = NativeStackScreenProps<RootStackParamList, "PlayerDetails">;

const PlayerDetailsScreen: React.FC<Props> = ({ route }) => {
  const { colors } = useTheme();
  const { playerId } = route.params;
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar detalles del jugador al montar el componente
  useEffect(() => {
    const loadPlayerDetails = async () => {
      try {
        setLoading(true);
        console.log("Solicitando datos del jugador con ID:", playerId);
        const response = await playerService.getPlayerById(playerId);
        console.log("Datos del jugador recibidos:", response);

        if (response && response.data) {
          console.log("Datos completos del jugador:", response.data);
          setPlayer(response.data);
        } else {
          console.warn("No se recibieron datos del jugador");
        }
      } catch (error) {
        console.error("Error al cargar los detalles del jugador:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setLoading(false);
      }
    };

    loadPlayerDetails();
  }, [playerId]);

  // Mostrar indicador de carga
  if (loading || !player) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Función para obtener el ícono según la posición
  const getPositionIcon = (position: string) => {
    switch (position) {
      case "Reves":
        return "hand-left";
      case "Drive":
        return "hand-right";
      default:
        return "help";
    }
  };

  // Función para obtener el ícono según la mano hábil
  const getHandIcon = (hand: string) => {
    return hand === "Derecha" ? "hand-right" : "hand-left";
  };

  // Función para formatear la fecha
  const formatDate = (dateString?: string | Date) => {
    try {
      if (!dateString) return "No disponible";

      // Crear la fecha
      const date = new Date(dateString);

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn("Fecha inválida:", dateString);
        return "No disponible";
      }

      // Formatear la fecha en español
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires", // Ajustar según la zona horaria
      };

      return date.toLocaleDateString("es-AR", options);
    } catch (error) {
      console.error(
        "Error al formatear la fecha:",
        error,
        "Valor recibido:",
        dateString
      );
      return "No disponible";
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: COLORS.white }]}>
      {/* Encabezado con foto de perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {player.profileImage ? (
            <Image
              source={{ uri: player.profileImage }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.avatarText}>
                {player.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.playerName, { color: COLORS.dark }]}>
          {player.firstName} {player.lastName}
        </Text>
        <Text style={[styles.playerCategory, { color: COLORS.primary }]}>
          {player.category}
        </Text>
      </View>

      {/* Información del jugador */}
      <View style={[styles.section, { backgroundColor: COLORS.white }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
          Información del Jugador
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="trophy" size={20} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.dark }]}>
            Nivel: <Text style={styles.infoValue}>{player.level}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={getHandIcon(player.hand || "")}
            size={20}
            color={COLORS.primary}
          />
          <Text style={[styles.infoText, { color: COLORS.dark }]}>
            Mano hábil: <Text style={styles.infoValue}>{player.hand}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={getPositionIcon(player.position || "")}
            size={20}
            color={COLORS.primary}
          />
          <Text style={[styles.infoText, { color: COLORS.dark }]}>
            Posición: <Text style={styles.infoValue}>{player.position}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={COLORS.primary} />
          <Text
            style={[styles.infoText, { color: COLORS.dark }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {player.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.dark }]}>
            Miembro desde:{" "}
            <Text style={styles.infoValue}>{formatDate(player.createdAt)}</Text>
          </Text>
        </View>
      </View>

      {/* Estadísticas (puedes expandir esta sección según necesites) */}
      <View style={[styles.statsContainer, { backgroundColor: COLORS.white }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
          Estadísticas
        </Text>
        <Text style={[styles.comingSoon, { color: COLORS.gray }]}>
          Próximamente: Estadísticas detalladas del jugador
        </Text>
      </View>
      {/* Sección de Valoración */}
      <View style={[styles.section, { marginBottom: 20 }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
          Valoración del Jugador
        </Text>
        <Text
          style={[
            styles.sectionTitle,
            { color: COLORS.gray, fontSize: 14, opacity: 0.8 },
          ]}
        >
          ¿Crees que la categoría asignada es la correcta?
        </Text>

        <View style={styles.ratingContainer}>
          <TouchableOpacity
            style={[styles.ratingButton, styles.ratingButtonLow]}
            onPress={() => handleVote("low")}
          >
            <Ionicons name="arrow-up-circle" size={20} color="#fff" />
            <Text style={styles.ratingButtonText}>Está Pasado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ratingButton, styles.ratingButtonGood]}
            onPress={() => handleVote("good")}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.ratingButtonText}>Está bien</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.ratingHelpText, { color: COLORS.gray }]}>
          Tu voto ayuda a mantener la equidad en las categorías
        </Text>
      </View>
    </ScrollView>
  );
};

// Función para manejar el voto
const handleVote = async (voteType: "low" | "good" | "high") => {
  try {
    // Aquí implementarías la lógica para enviar el voto al servidor
    // Por ejemplo: await playerService.ratePlayer(playerId, voteType);

    // Mostrar mensaje de confirmación
    let message = "";
    switch (voteType) {
      case "high":
        message =
          "Has votado que el jugador está en una categoría más alta de lo que debería";
        break;
      case "good":
        message = "Has votado que el jugador está en la categoría correcta";
        break;
      case "low":
        message =
          "Has votado que el jugador está en una categoría más baja de lo que debería";
        break;
    }

    Alert.alert("Voto registrado", message);
  } catch (error) {
    console.error("Error al registrar el voto:", error);
    Alert.alert("Error", "No se pudo registrar tu voto. Intenta de nuevo.");
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  avatarContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 56,
    fontWeight: "bold",
  },
  playerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 5,
    textAlign: "center",
  },
  playerCategory: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 5,
  },
  playerCity: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 15,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.dark,
    flex: 1,
  },
  infoValue: {
    fontWeight: "600",
    color: COLORS.dark,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    flexWrap: "wrap",
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 10,
    minWidth: "48%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ratingButtonLow: {
    backgroundColor: "#4CAF50", // Verde para "Está bien"
  },
  ratingButtonGood: {
    backgroundColor: "#FFC107", // Amarillo para "Está fácil"
  },
  ratingButtonHigh: {
    backgroundColor: "#F44336", // Rojo para "Está difícil"
  },
  ratingButtonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  ratingHelpText: {
    fontSize: 12,
    textAlign: "center",
    color: COLORS.gray,
    marginTop: 12,
    lineHeight: 18,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  comingSoon: {
    textAlign: "center",
    color: COLORS.gray,
    fontStyle: "italic",
    marginVertical: 10,
  },

  // Estilos para los íconos
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 90, 95, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayerDetailsScreen;
