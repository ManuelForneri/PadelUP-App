import React, { useEffect, useState, useCallback } from "react";
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
import { COLORS } from "../../theme/colors";
import playerService from "../../services/api/player.service";
import { Player } from "../../../types";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "PlayerDetails">;

const PlayerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { playerId } = route.params;
  const { user } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [voting, setVoting] = useState<boolean>(false);

  // Función para manejar el voto
  const handleVote = useCallback(async (voteType: "low" | "good" | "high") => {
    if (!user?.id) {
      Alert.alert("Error", "Debes iniciar sesión para poder votar.");
      navigation.navigate("Login");
      return;
    }

    if (!playerId) {
      Alert.alert("Error", "No se pudo identificar al jugador a votar.");
      return;
    }

    try {
      setVoting(true);
      
      // Mapear los tipos de voto de la interfaz a los que espera el backend
      const voteTypeMap = {
        low: "upVotes",    // Si está bajo, necesita subir de categoría (upVote)
        good: "good",      // Si está bien, no debería afectar la categoría
        high: "downVotes"  // Si está alto, necesita bajar de categoría (downVote)
      };

      // Solo enviar el voto si no es "good" (que no afecta la categoría)
      if (voteType !== "good") {
        await playerService.votePlayer(
          playerId,
          voteTypeMap[voteType] as "upVotes" | "downVotes",
          user.id
        );
      }

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

      Alert.alert("Voto registrado", message, [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error("Error al registrar el voto:", error);
      
      // Mostrar mensaje de error específico del backend si está disponible
      const errorMessage = error.response?.data?.message || 
                         "No se pudo registrar tu voto. Intenta de nuevo.";
      
      Alert.alert("Error", errorMessage);
    } finally {
      setVoting(false);
    }
  }, [user, playerId, navigation]);

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
    <ScrollView
      style={[styles.container, { backgroundColor: COLORS.backgroundLight }]}
    >
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
        <Text style={[styles.playerName, { color: COLORS.textDark }]}>
          {player.firstName} {player.lastName}
        </Text>
        <Text style={[styles.playerCategory, { color: COLORS.primary }]}>
          {player.category}
        </Text>
      </View>

      {/* Información del jugador */}
      <View
        style={[styles.section, { backgroundColor: COLORS.backgroundLight }]}
      >
        <Text style={[styles.sectionTitle, { color: COLORS.textDark }]}>
          Información del Jugador
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="trophy" size={20} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.textDark }]}>
            Nivel: <Text style={styles.infoValue}>{player.level}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={getHandIcon(player.hand || "")}
            size={20}
            color={COLORS.primary}
          />
          <Text style={[styles.infoText, { color: COLORS.textDark }]}>
            Mano hábil: <Text style={styles.infoValue}>{player.hand}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={getPositionIcon(player.position || "")}
            size={20}
            color={COLORS.primary}
          />
          <Text style={[styles.infoText, { color: COLORS.textDark }]}>
            Posición: <Text style={styles.infoValue}>{player.position}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={COLORS.primary} />
          <Text
            style={[styles.infoText, { color: COLORS.textDark }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {player.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.textDark }]}>
            Miembro desde:{" "}
            <Text style={styles.infoValue}>{formatDate(player.createdAt)}</Text>
          </Text>
        </View>
      </View>

      {/* Estadísticas (puedes expandir esta sección según necesites) */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: COLORS.backgroundLight },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: COLORS.textDark }]}>
          Estadísticas
        </Text>
        <Text style={[styles.comingSoon, { color: COLORS.gray }]}>
          Próximamente: Estadísticas detalladas del jugador
        </Text>
      </View>
      {/* Sección de Valoración */}
      <View style={[styles.section, { marginBottom: 20 }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.textDark }]}>
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
            style={[
              styles.ratingButton, 
              styles.ratingButtonLow,
              voting && styles.disabledButton
            ]}
            onPress={() => handleVote("low")}
            disabled={voting}
          >
            {voting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="arrow-up-circle" size={20} color="#fff" />
                <Text style={styles.ratingButtonText}>Está Pasado</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingButton, 
              styles.ratingButtonGood,
              voting && styles.disabledButton
            ]}
            onPress={() => handleVote("good")}
            disabled={voting}
          >
            {voting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.ratingButtonText}>Está bien</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.ratingHelpText, { color: COLORS.gray }]}>
          Tu voto ayuda a mantener la equidad en las categorías
        </Text>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: COLORS.backgroundLight,
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
    color: COLORS.textLight,
    fontSize: 56,
    fontWeight: "bold",
  },
  playerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textDark,
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
    backgroundColor: COLORS.backgroundLight,
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
    color: COLORS.textDark,
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
    color: COLORS.textDark,
    flex: 1,
  },
  infoValue: {
    fontWeight: "600",
    color: COLORS.textDark,
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
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.6,
  },
  ratingHelpText: {
    fontSize: 12,
    textAlign: "center",
    color: COLORS.gray,
    marginTop: 12,
    lineHeight: 18,
  },
  statsContainer: {
    backgroundColor: COLORS.backgroundLight,
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
