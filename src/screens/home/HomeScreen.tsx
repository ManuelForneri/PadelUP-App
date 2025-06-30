import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Datos de ejemplo
  const courts = ["La Nueva Estacion", "El Fronton", "La Reserva"];
  const tournaments = ["Copa Invierno", "Relámpago Junio"];

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>PadelSAG</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.profileButton}
        >
          <Ionicons name="person-circle-outline" size={30} color="#10B981" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Próximos partidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Partidos</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Viernes 19:00 - Complejo El Triángulo
            </Text>
            <Text style={styles.cardSubtitle}>Nivel: Intermedio</Text>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>Unirme</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buscar jugadores */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('PlayerSearch')}
        >
          <Ionicons name="search" size={20} color="#10B981" style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Buscar Jugadores</Text>
        </TouchableOpacity>

        {/* Canchas disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canchas Disponibles</Text>
          <View style={styles.courtsContainer}>
            {courts.map((court) => (
              <View key={court} style={styles.card}>
                <Text style={styles.courtName}>{court}</Text>
                <Text style={styles.availableText}>Libre</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ranking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ranking Local</Text>
          <View style={[styles.card, styles.rankingCard]}>
            <Text style={styles.rankingItem}>🥇 Juan P.</Text>
            <Text style={styles.rankingItem}>🥈 Martín G.</Text>
            <Text style={styles.rankingItem}>🥉 Lucas D.</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Ver ranking completo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Torneos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Torneos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tournamentsContainer}
          >
            {tournaments.map((tournament) => (
              <View
                key={tournament}
                style={[styles.card, styles.tournamentCard]}
              >
                <Text style={styles.cardTitle}>{tournament}</Text>
                <Text style={styles.cardSubtitle}>Inscripción abierta</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Encabezado
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  profileButton: {
    padding: 8,
  },

  // Contenido principal
  content: {
    padding: 16,
  },

  // Secciones
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1F2937",
  },

  // Tarjetas
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },

  // Botones
  primaryButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  buttonIcon: {
    marginRight: 8,
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontWeight: "600",
    fontSize: 16,
  },

  // Lista de canchas
  courtsContainer: {
    gap: 12,
  },
  courtName: {
    fontSize: 15,
    fontWeight: "500",
  },
  availableText: {
    color: "#10B981",
    fontWeight: "500",
    marginTop: 4,
  },

  // Ranking
  rankingCard: {
    paddingVertical: 12,
  },
  rankingItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  linkText: {
    color: "#3B82F6",
    marginTop: 8,
    fontWeight: "500",
  },

  // Torneos
  tournamentsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
  tournamentCard: {
    width: 160,
    padding: 12,
  },
});

export default HomeScreen;
