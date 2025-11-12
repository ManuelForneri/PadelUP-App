import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";

// Tipo para un jugador en el ranking
interface RankingPlayer {
  id: number;
  position: number;
  name: string;
  points: number;
  trend: "up" | "down" | "stable";
  category: string;
}

const RankingScreen = () => {
  // Lista de jugadores (por ahora datos de ejemplo)
  const players: RankingPlayer[] = [
    { id: 1, position: 1, name: "Juan Pérez", points: 1250, trend: "up", category: "1ra" },
    { id: 2, position: 2, name: "María González", points: 1180, trend: "up", category: "1ra" },
    { id: 3, position: 3, name: "Carlos Rodríguez", points: 1120, trend: "down", category: "2da" },
    { id: 4, position: 4, name: "Ana Martínez", points: 1080, trend: "stable", category: "2da" },
    { id: 5, position: 5, name: "Luis Fernández", points: 1050, trend: "up", category: "3ra" },
    { id: 6, position: 6, name: "Laura Sánchez", points: 1020, trend: "up", category: "3ra" },
    { id: 7, position: 7, name: "Pedro López", points: 980, trend: "down", category: "4ta" },
    { id: 8, position: 8, name: "Sofía García", points: 950, trend: "stable", category: "4ta" },
  ];

  // Obtener los primeros 3 para el podio
  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);

  // Función simple para obtener el color según la posición
  const getMedalColor = (position: number) => {
    if (position === 1) return "#FFD700"; // Oro
    if (position === 2) return "#C0C0C0"; // Plata
    if (position === 3) return "#CD7F32"; // Bronce
    return COLORS.primary;
  };

  // Función simple para obtener el icono de tendencia
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "trending-up";
    if (trend === "down") return "trending-down";
    return "remove";
  };

  // Función simple para obtener el color de tendencia
  const getTrendColor = (trend: string) => {
    if (trend === "up") return COLORS.success;
    if (trend === "down") return COLORS.error;
    return COLORS.gray;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Ranking</Text>
          <Text style={styles.subtitle}>Clasificación de jugadores por puntos</Text>
        </View>

        {/* Filtros */}
        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Por Categoría</Text>
          </TouchableOpacity>
        </View>

        {/* Podio - Top 3 */}
        <View style={styles.podium}>
          {topThree.map((player) => (
            <View key={player.id} style={styles.podiumItem}>
              <View
                style={[
                  styles.podiumBadge,
                  { backgroundColor: getMedalColor(player.position) },
                ]}
              >
                <MaterialCommunityIcons name="medal" size={32} color="#fff" />
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {player.name}
              </Text>
              <Text style={styles.podiumPoints}>{player.points} pts</Text>
            </View>
          ))}
        </View>

        {/* Lista completa de ranking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clasificación Completa</Text>
          <View style={styles.rankingList}>
            {restOfPlayers.map((player) => (
              <View key={player.id} style={styles.rankingItem}>
                {/* Posición */}
                <View style={styles.positionContainer}>
                  <View
                    style={[
                      styles.positionBadge,
                      { backgroundColor: getMedalColor(player.position) },
                    ]}
                  >
                    <Text style={styles.positionText}>{player.position}°</Text>
                  </View>
                </View>

                {/* Información del jugador */}
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.playerMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{player.category}</Text>
                    </View>
                    <Text style={styles.playerPoints}>{player.points} pts</Text>
                  </View>
                </View>

                {/* Icono de tendencia */}
                <View style={styles.trendContainer}>
                  <Ionicons
                    name={getTrendIcon(player.trend)}
                    size={24}
                    color={getTrendColor(player.trend)}
                  />
                </View>
              </View>
            ))}
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
  filters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.gray + "40",
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "600",
  },
  filterTextActive: {
    color: COLORS.textPrimary,
  },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
    height: 180,
  },
  podiumItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  podiumBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: "center",
  },
  podiumPoints: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
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
  rankingList: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  positionContainer: {
    width: 50,
    alignItems: "center",
  },
  positionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  positionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  playerPoints: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "600",
  },
  trendContainer: {
    width: 40,
    alignItems: "center",
  },
});

export default RankingScreen;
