import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTournaments } from "../services/api";
import { Tournament, TournamentStatus } from "../types/tournament";

const STATUS_CONFIG: Record<
  TournamentStatus,
  { label: string; color: string; bgColor: string }
> = {
  UPCOMING: { label: "Próximamente", color: "#FFD700", bgColor: "#FFD70015" },
  IN_PROGRESS: { label: "En curso", color: "#00D9A6", bgColor: "#00D9A615" },
  COMPLETED: { label: "Finalizado", color: "#6B7280", bgColor: "#6B728015" },
  CANCELLED: { label: "Cancelado", color: "#EF4444", bgColor: "#EF444415" },
};

export default function TournamentsScreen() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = useCallback(async () => {
    try {
      const data = await getTournaments();
      setTournaments(data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTournaments();
  }, [fetchTournaments]);

  const renderTournament = ({ item }: { item: Tournament }) => {
    const config = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        {item.flyer ? (
          <Image
            source={{ uri: item.flyer }}
            style={styles.cardFlyer}
            resizeMode="cover"
          />
        ) : null}

        {/* Superior */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* Inferior */}
        <View style={styles.cardFooter}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            <Text style={styles.infoText}>
              {item.start_date.split("-").reverse().join("/")} -{" "}
              {item.end_date.split("-").reverse().join("/")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={16} color="#00D9A6" />
            <Text style={styles.priceText}>
              ${Number(item.price).toLocaleString("es-AR")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fondo superior */}
      <View style={styles.headerBg} />

      {/* Título de la pantalla */}
      <View style={styles.header}>
        <Ionicons name="trophy-outline" size={32} color="#FFD700" />
        <Text style={styles.headerTitle}>Torneos SAG</Text>
      </View>

      {/* Contenido principal */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00D9A6" />
        </View>
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id}
          renderItem={renderTournament}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={64} color="#2D3F50" />
              <Text style={styles.emptyTitle}>Sin torneos</Text>
              <Text style={styles.emptySubtitle}>
                Aún no hay torneos disponibles.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00D9A6"
              colors={["#00D9A6"]}
              progressBackgroundColor="#1E2D3D"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: "#1E2D3D",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#1E2D3D",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2D3F50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cardFlyer: {
    width: "100%",
    height: 140,
    backgroundColor: "#2D3F50",
    marginBottom: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  description: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#2D3F50",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#00D9A6",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#4B5563",
    marginTop: 8,
  },
});
