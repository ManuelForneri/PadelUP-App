import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants/player";
import { formatISODate } from "../utils/date";

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const categoryColor = user.category
    ? CATEGORY_COLORS[user.category]
    : "#6B7280";
  const categoryLabel = user.category
    ? CATEGORY_LABELS[user.category]
    : "Sin asignar";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header bg */}
      <View style={styles.headerBg} />

      {/* Avatar & Name */}
      <View style={styles.profileHeader}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>
              {user.first_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.fullName}>
          {user.first_name} {user.last_name ?? ""}
        </Text>
        <Text style={styles.email}>{user.email}</Text>

        {/* Category badge */}
        <View style={[styles.categoryBadge, { borderColor: categoryColor }]}>
          <View
            style={[styles.categoryDot, { backgroundColor: categoryColor }]}
          />
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {categoryLabel}
          </Text>
        </View>

        {/* Points banner */}
        <View style={styles.pointsBanner}>
          <Text style={styles.pointsValue}>{user.points}</Text>
          <Text style={styles.pointsLabel}>puntos</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos del jugador</Text>
        <InfoRow
          label="Posición en cancha"
          value={
            user.court_side === "DRIVE"
              ? "Drive"
              : user.court_side === "REVES"
                ? "Revés"
                : user.court_side === "AMBOS"
                  ? "Ambos"
                  : null
          }
        />
        <InfoRow
          label="Mano dominante"
          value={
            user.dominant_hand === "DERECHA"
              ? "Derecha"
              : user.dominant_hand === "IZQUIERDA"
                ? "Izquierda"
                : null
          }
        />
        <InfoRow
          label="Fecha de nacimiento"
          value={formatISODate(user.birth_date)}
        />
        <InfoRow label="Teléfono" value={user.phone} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cuenta</Text>
        <InfoRow
          label="Rol"
          value={user.role === "ADMIN" ? "Administrador" : "Jugador"}
        />
        <InfoRow
          label="Estado"
          value={user.status === "ACTIVE" ? "Activo" : "Pendiente"}
        />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Miembro desde" value={formatISODate(user.created_at)} />
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
  },
  content: {
    paddingBottom: 60,
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "#1E2D3D",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  profileHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#00D9A6",
    marginBottom: 4,
  },
  avatarFallback: {
    backgroundColor: "#00D9A620",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#00D9A6",
    fontWeight: "800",
    fontSize: 36,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  email: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 8,
    marginTop: 4,
    backgroundColor: "#0F1923",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontWeight: "700",
    fontSize: 13,
  },
  pointsBanner: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 8,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFD700",
  },
  pointsLabel: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  card: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: "#1E2D3D",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2D3F50",
    gap: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00D9A6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2D3F5080",
  },
  infoLabel: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    color: "#D1D5DB",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  logoutBtn: {
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EF444440",
    alignItems: "center",
    backgroundColor: "#EF444410",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 16,
  },
});
