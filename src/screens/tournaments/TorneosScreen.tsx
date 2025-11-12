import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";
import tournamentService, {
  Tournament,
} from "../../services/api/tournament.service";

const TorneosScreen = () => {
  // Estados para manejar los datos
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los torneos de la API
  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tournamentService.getTournaments();

      if (response.success && response.data) {
        setTournaments(response.data);
      } else {
        setError("No se pudieron cargar los torneos");
      }
    } catch (err: any) {
      console.error("Error al cargar torneos:", err);
      setError(err.message || "Error al cargar los torneos");
      Alert.alert(
        "Error",
        "No se pudieron cargar los torneos. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar torneos cuando se monta el componente
  useEffect(() => {
    fetchTournaments();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date
      .toLocaleString("es-ES", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Función para determinar el estado del torneo
  const getTournamentStatus = (tournament: Tournament) => {
    const now = new Date();
    const deadline = new Date(tournament.registrationDeadline);
    const startDate = new Date(tournament.startDate);

    if (now < deadline) {
      return { text: "Inscripciones abiertas", style: "open" };
    } else if (now < startDate) {
      return { text: "Inscripciones cerradas", style: "closed" };
    } else if (now == startDate) {
      return { text: "En curso", style: "active" };
    } else {
      return { text: "Finalizado", style: "finished" };
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando torneos...</Text>
      </View>
    );
  }

  // Mostrar error
  if (error && tournaments.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={COLORS.error}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTournaments}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Torneos</Text>
          <Text style={styles.subtitle}>Descubre los torneos disponibles</Text>
        </View>

        {/* Lista de torneos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Torneos Disponibles ({tournaments.length})
          </Text>

          {tournaments.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={64}
                color={COLORS.gray}
              />
              <Text style={styles.emptyStateText}>
                No hay torneos disponibles en este momento
              </Text>
            </View>
          ) : (
            tournaments.map((tournament) => {
              const status = getTournamentStatus(tournament);
              return (
                <View key={tournament._id} style={styles.card}>
                  {/* Imagen del torneo si existe */}
                  {tournament.imageUrl && (
                    <Image
                      source={{ uri: tournament.imageUrl }}
                      style={styles.tournamentImage}
                      resizeMode="cover"
                    />
                  )}

                  {/* Icono y título */}
                  <View style={styles.cardHeader}>
                    <MaterialCommunityIcons
                      name="trophy"
                      size={28}
                      color={COLORS.warning}
                    />
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{tournament.name}</Text>
                      <Text style={styles.cardDate}>
                        {formatDate(tournament.startDate)} -{" "}
                        {formatDate(tournament.endDate)}
                      </Text>
                    </View>
                  </View>

                  {/* Información del torneo */}
                  <View style={styles.cardInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>{tournament.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="cash-multiple"
                        size={16}
                        color={COLORS.gray}
                      />
                      <Text style={styles.infoText}>
                        ${tournament.registrationFee.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="tag"
                        size={16}
                        color={COLORS.gray}
                      />
                      <Text style={styles.infoText}>{tournament.category}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name={tournament.isMixed ? "account-group" : "account"}
                        size={16}
                        color={COLORS.gray}
                      />
                      <Text style={styles.infoText}>
                        {tournament.isMixed ? "Mixto" : "No Mixto"}
                      </Text>
                    </View>
                  </View>

                  {/* Badge de estado */}
                  <View
                    style={[
                      styles.badge,
                      status.style === "open"
                        ? styles.badgeOpen
                        : status.style === "closed"
                          ? styles.badgeClosed
                          : styles.badgeActive,
                    ]}
                  >
                    <Text style={styles.badgeText}>{status.text}</Text>
                  </View>

                  {/* Botón de acción */}
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                      {status.style === "open" ? "Inscribirse" : "Ver detalles"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        {/* Sección de mis torneos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Torneos</Text>
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={64}
              color={COLORS.gray}
            />
            <Text style={styles.emptyStateText}>
              No estás inscrito en ningún torneo
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explorar Torneos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  tournamentImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 6,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  badgeOpen: {
    backgroundColor: "rgba(46, 204, 113, 0.2)",
  },
  badgeClosed: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
  },
  badgeActive: {
    backgroundColor: "rgba(52, 152, 219, 0.2)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  exploreButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
});

export default TorneosScreen;
