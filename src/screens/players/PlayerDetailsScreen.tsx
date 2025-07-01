import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import playerService from "../../services/api/player.service";
import { Player } from "../../../types";

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
        const response = await playerService.getPlayerById(playerId);
        setPlayer(response.data);
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
        <ActivityIndicator size="large" color={colors.primary} />
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
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
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
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {player.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.playerName, { color: colors.text }]}>
          {player.firstName} {player.lastName}
        </Text>
        <Text style={[styles.playerCategory, { color: colors.primary }]}>
          {player.category}
        </Text>
      </View>

      {/* Información del jugador */}
      <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Información del Jugador
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="trophy" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Nivel: <Text style={styles.infoValue}>{player.level}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={getHandIcon(player.hand || "")}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Mano hábil: <Text style={styles.infoValue}>{player.hand}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={getPositionIcon(player.position || "")}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Posición: <Text style={styles.infoValue}>{player.position}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={colors.primary} />
          <Text
            style={[styles.infoText, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {player.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Miembro desde:{" "}
            <Text style={styles.infoValue}>{formatDate(player.createdAt)}</Text>
          </Text>
        </View>
      </View>

      {/* Estadísticas (puedes expandir esta sección según necesites) */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Estadísticas
        </Text>
        <Text style={[styles.comingSoon, { color: colors.text + "80" }]}>
          Próximamente: Estadísticas detalladas del jugador
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  playerCategory: {
    fontSize: 18,
    fontWeight: "600",
    opacity: 0.8,
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    fontWeight: "600",
  },
  statsContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  comingSoon: {
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 16,
  },
});

export default PlayerDetailsScreen;
