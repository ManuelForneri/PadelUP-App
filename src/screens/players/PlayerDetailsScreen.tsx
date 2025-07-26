import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GLOBAL_STYLES, TYPOGRAPHY, COMPONENTS } from "../../theme/styles";
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
  const [hasVoted, setHasVoted] = useState<boolean>(false);

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
          
          // Verificar si el usuario actual ya votó por este jugador
          if (user?.id && response.data.votes?.voters?.includes(user.id)) {
            setHasVoted(true);
          }
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
        <ActivityIndicator size="large" color={COLORS.green[500]} />
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
      style={[styles.container, { backgroundColor: COLORS.neutral[50] }]}
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
            <View style={[styles.avatar, { backgroundColor: COLORS.green[500] }]}>
              <Text style={styles.avatarText}>
                {player.firstName.charAt(0)}
                {player.lastName?.charAt(0) || ''}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {player.firstName} {player.lastName}
          </Text>
          <Text style={styles.playerCategory}>{player.category}</Text>
          <Text style={styles.playerLevel}>Nivel {player.level}</Text>
        </View>
      </View>

      {/* Sección de información personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color={COLORS.green[500]} />
          <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
            {player.email || 'No disponible'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color={COLORS.green[500]} />
          <Text style={styles.infoText}>
            Miembro desde: {player.createdAt ? formatDate(player.createdAt) : 'No disponible'}
          </Text>
        </View>
      </View>

      {/* Sección de características de juego */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Características de Juego</Text>
        <View style={styles.infoRow}>
          <Ionicons name={getHandIcon(player.hand || 'Derecha')} size={20} color={COLORS.green[500]} />
          <Text style={styles.infoText}>Mano hábil: {player.hand || 'No especificado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name={getPositionIcon(player.position || '')} size={20} color={COLORS.green[500]} />
          <Text style={styles.infoText}>Posición preferida: {player.position || 'No especificada'}</Text>
        </View>
      </View>

      {/* Sección de votación */}
      {!hasVoted && user?.id !== player._id && (
        <View style={styles.votingSection}>
          <Text style={styles.votingTitle}>¿Este jugador está en la categoría correcta?</Text>
          <View style={styles.votingButtons}>
            <TouchableOpacity
              style={[styles.voteButton, styles.voteButtonHigh]}
              onPress={() => handleVote('high')}
              disabled={voting}
            >
              <Text style={styles.voteButtonText}>Muy alto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.voteButton, styles.voteButtonGood]}
              onPress={() => handleVote('good')}
              disabled={voting}
            >
              <Text style={styles.voteButtonText}>Correcto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.voteButton, styles.voteButtonLow]}
              onPress={() => handleVote('low')}
              disabled={voting}
            >
              <Text style={styles.voteButtonText}>Muy bajo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {hasVoted && (
        <View style={styles.votingMessage}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.green[500]} />
          <Text style={styles.votingMessageText}>¡Ya has votado por este jugador!</Text>
        </View>
      )}
    </ScrollView>
  );
};

// Usando estilos en línea con GLOBAL_STYLES y la nueva paleta de colores
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[0],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[0],
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.neutral[0],
    fontSize: 56,
    fontWeight: '700' as const,
  },
  playerInfo: {
    alignItems: 'center',
  },
  playerName: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    color: COLORS.neutral[900],
    marginBottom: 5,
    fontWeight: '700' as const,
  },
  playerCategory: {
    ...TYPOGRAPHY.body1,
    color: COLORS.green[500],
    marginBottom: 5,
    fontWeight: '500' as const,
  },
  playerLevel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.neutral[600],
    fontWeight: '400' as const,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.green[600],
    marginBottom: 15,
    fontWeight: '600' as const,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.neutral[800],
    marginLeft: 10,
    fontWeight: '400' as const,
  },
  votingSection: {
    padding: 20,
    backgroundColor: COLORS.neutral[50],
    margin: 15,
    borderRadius: 10,
    shadowColor: COLORS.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  votingTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.neutral[900],
    marginBottom: 15,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
  },
  votingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: 5,
  },
  voteButtonHigh: {
    backgroundColor: COLORS.green[300],
  },
  voteButtonGood: {
    backgroundColor: COLORS.green[500],
  },
  voteButtonLow: {
    backgroundColor: COLORS.green[700],
  },
  voteButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral[0],
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  votingMessage: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 15,
    backgroundColor: COLORS.green[50],
    margin: 15,
    borderRadius: 8,
  },
  votingMessageText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.green[800],
    marginLeft: 10,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.green[400]}20`,
    ...GLOBAL_STYLES.flexCenter,
  },
  icon: {
    color: COLORS.green[400],
  },
  statsRow: {
    ...GLOBAL_STYLES.flexRowBetween,
    marginBottom: 15,
  },
  statItem: {
    ...GLOBAL_STYLES.flexCenter,
    flex: 1,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.green[800],
    marginBottom: 5,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral[500],
    textAlign: 'center',
  },
  bioText: {
    ...TYPOGRAPHY.body1,
    lineHeight: 22,
  },
  emptyState: {
    ...TYPOGRAPHY.body2,
    textAlign: 'center',
    color: COLORS.neutral[500],
    fontStyle: 'italic',
    marginVertical: 20,
  },
  actionButton: {
    ...COMPONENTS.button.primary,
    marginTop: 20,
    ...GLOBAL_STYLES.flexCenter,
    padding: 15,
  },
});

export default PlayerDetailsScreen;
