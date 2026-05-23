import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  COURT_SIDE_LABELS,
  HAND_LABELS,
} from "../constants/player";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  if (!user) return null;

  const categoryColor = user.category
    ? CATEGORY_COLORS[user.category]
    : "#6B7280";
  const categoryLabel = user.category
    ? CATEGORY_LABELS[user.category]
    : "Sin categoría";
  const greeting = getGreeting();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Background decoration */}
      <View style={styles.headerBg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>
              {user.first_name} {user.last_name ?? ""}
            </Text>
          </View>
          {user.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>
                {user.first_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Category badge */}
        <View style={[styles.categoryBadge, { borderColor: categoryColor }]}>
          <View
            style={[styles.categoryDot, { backgroundColor: categoryColor }]}
          />
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {categoryLabel}
          </Text>
        </View>
      </View>

      {/* Stats grid */}
      <Text style={styles.sectionTitle}>Tu estadística</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Puntos" value={String(user.points)} color="#FFD700" />
        <StatCard
          label="Posición"
          value={user.court_side ? COURT_SIDE_LABELS[user.court_side] : "—"}
          color="#00D9A6"
        />
        <StatCard
          label="Mano"
          value={user.dominant_hand ? HAND_LABELS[user.dominant_hand] : "—"}
          color="#007AFF"
        />
        <StatCard
          label="Estado"
          value={user.status === "ACTIVE" ? "Activo" : "Pendiente"}
          color={user.status === "ACTIVE" ? "#00D9A6" : "#F59E0B"}
        />
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>🏓 Liga SAG</Text>
        <Text style={styles.infoCardText}>
          Bienvenido a Padel UP, la app oficial de la Liga SAG de San Andrés de
          Giles. Pronto podrás ver torneos, resultados y más.
        </Text>
      </View>

      {/* Email row */}
      <View style={styles.emailRow}>
        <Text style={styles.emailLabel}>Cuenta</Text>
        <Text style={styles.emailValue}>{user.email}</Text>
      </View>
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días,";
  if (hour < 19) return "Buenas tardes,";
  return "Buenas noches,";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
  },
  content: {
    paddingBottom: 40,
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "#1E2D3D",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: "#00D9A6",
  },
  avatarFallback: {
    backgroundColor: "#00D9A620",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#00D9A6",
    fontWeight: "800",
    fontSize: 22,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 8,
    backgroundColor: "#0F1923",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontWeight: "700",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: "#1E2D3D",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D3F50",
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: "#1E2D3D",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2D3F50",
    gap: 10,
  },
  infoCardTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  infoCardText: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 22,
  },
  emailRow: {
    marginHorizontal: 24,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E2D3D",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2D3F50",
  },
  emailLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  emailValue: {
    color: "#9CA3AF",
    fontSize: 13,
    flex: 1,
    textAlign: "right",
  },
});
