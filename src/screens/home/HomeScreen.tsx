import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../../components/home/Header";

// Application colors
const COLORS = {
  primary: "#FF5A5F", // Coral red
  secondary: "#00A699", // Teal
  dark: "#2D3436", // Dark gray
  light: "#F7F9F9", // Very light gray
  white: "#FFFFFF",
  gray: "#A4A4A4",
  error: "#E74C3C",
  success: "#2ECC71",
  warning: "#F39C12",
  info: "#3498DB",
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_MARGIN = 15;
const CONTAINER_PADDING = 20;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Match {
  id: number;
  time: string;
  date: string;
  location: string;
  level: string;
}

interface Court {
  id: number;
  name: string;
  status: "Disponible" | "Ocupado";
  time: string;
}

interface Tournament {
  id: number;
  name: string;
  date: string;
  status: string;
}

// Base styles with improved shadow
const baseShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
};

const baseCard = {
  backgroundColor: COLORS.white,
  borderRadius: 16, // Slightly more rounded corners
  padding: 18, // Increased padding for better spacing
  ...baseShadow,
};

const baseText = {
  color: COLORS.dark,
  includeFontPadding: false, // Better text alignment
  textAlignVertical: "center" as const, // Type assertion for React Native
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Datos de ejemplo
  const upcomingMatches: Match[] = [
    {
      id: 1,
      time: "19:00",
      date: "VIE 10 JUN",
      location: "Complejo El Triángulo",
      level: "Intermedio",
    },
    {
      id: 2,
      time: "20:30",
      date: "SÁB 11 JUN",
      location: "Club PadelSAG",
      level: "Avanzado",
    },
  ];

  const availableCourts: Court[] = [
    {
      id: 1,
      name: "La Nueva Estación",
      status: "Disponible",
      time: "19:00 - 20:30",
    },
    {
      id: 2,
      name: "El Frontón",
      status: "Disponible",
      time: "20:30 - 22:00",
    },
    {
      id: 3,
      name: "La Reserva",
      status: "Ocupado",
      time: "19:00 - 20:30",
    },
  ];

  const upcomingTournaments: Tournament[] = [
    {
      id: 1,
      name: "Torneo de Invierno",
      date: "15 JUN 2023",
      status: "Inscripciones abiertas",
    },
    {
      id: 2,
      name: "Copa Verano Relámpago",
      date: "30 JUN 2023",
      status: "Próximamente",
    },
  ];

  const renderMatchCard = (match: Match) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchTimeContainer}>
        <Text style={styles.matchTime}>{match.time}</Text>
        <Text style={styles.matchDate}>{match.date}</Text>
      </View>
      <View style={styles.matchDetails}>
        <Text style={styles.matchLocation}>{match.location}</Text>
        <View style={styles.matchMeta}>
          <Text style={styles.matchLevel}>{match.level}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Unirse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCourtCard = (court: Court) => (
    <View key={court.id} style={styles.courtCard}>
      <View style={styles.courtInfo}>
        <Text style={styles.courtName}>{court.name}</Text>
        <View
          style={[
            styles.statusBadge,
            court.status === "Disponible"
              ? styles.availableBadge
              : styles.occupiedBadge,
          ]}
        >
          <Text style={styles.statusText}>{court.status}</Text>
        </View>
      </View>
      <Text style={styles.courtTime}>{court.time}</Text>
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTournamentCard = (tournament: Tournament) => (
    <View key={tournament.id} style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <MaterialCommunityIcons
          name="trophy"
          size={24}
          color={COLORS.warning}
        />
        <Text style={styles.tournamentName}>{tournament.name}</Text>
      </View>
      <Text style={styles.tournamentDate}>{tournament.date}</Text>
      <View style={[styles.statusBadge, styles.tournamentBadge]}>
        <Text style={styles.statusText}>{tournament.status}</Text>
      </View>
    </View>
  );
  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header onProfilePress={handleProfilePress} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate("PlayerSearch")}
        >
          <Ionicons name="search" size={20} color={COLORS.gray} />
          <Text style={styles.searchText}>
            Buscar jugadores, torneos, canchas...
          </Text>
        </TouchableOpacity>

        {/* Upcoming Matches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Partidos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {upcomingMatches.map(renderMatchCard)}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: "rgba(0, 166, 153, 0.1)" },
              ]}
            >
              <MaterialCommunityIcons
                name="calendar-plus"
                size={24}
                color={COLORS.secondary}
              />
            </View>
            <Text style={styles.quickActionText}>Nuevo Partido</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton}>
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: "rgba(255, 90, 95, 0.1)" },
              ]}
            >
              <Ionicons name="tennisball" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Unirse a Partido</Text>
          </TouchableOpacity>
        </View>

        {/* Available Courts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Canchas Disponibles</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.courtsGrid}>
            {availableCourts.slice(0, 2).map(renderCourtCard)}
          </View>
        </View>

        {/* Upcoming Tournaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Torneos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {upcomingTournaments.map(renderTournamentCard)}
          </ScrollView>
        </View>

        {/* Local Ranking */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ranking Local</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver ranking completo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rankingContainer}>
            {[1, 2, 3].map((position) => (
              <View key={position} style={styles.rankingItem}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{position}°</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>Jugador {position}</Text>
                  <Text style={styles.playerPoints}>1,25{position}0 pts</Text>
                </View>
                <View style={styles.trendIndicator}>
                  <Ionicons
                    name="trending-up"
                    size={20}
                    color={position % 2 === 0 ? COLORS.success : COLORS.error}
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
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20, // Add bottom padding for better scroll
  },

  // Header with improved styling
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: CONTAINER_PADDING,
    paddingTop: CONTAINER_PADDING + 10, // Extra padding at top for status bar
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...baseShadow,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: CARD_MARGIN * 1.5,
    zIndex: 10, // Ensure header stays above other elements
  },

  // Text Styles with better typography
  greeting: {
    ...baseText,
    fontSize: 26,
    fontWeight: "800", // Slightly bolder for better hierarchy
    letterSpacing: -0.5, // Tighter letter spacing for headings
    lineHeight: 32, // Better line height for readability
  },
  subtitle: {
    ...baseText,
    fontSize: 15,
    color: COLORS.gray,
    marginTop: 6,
    lineHeight: 20, // Better line height for body text
    opacity: 0.9, // Slightly more visible
  },

  // Buttons with better feedback
  profileButton: {
    width: 44, // Slightly larger for better touch target
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 90, 95, 0.1)",
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  profileButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  // Search with improved styling
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12, // More rounded corners
    padding: 14, // Slightly more padding
    marginHorizontal: CONTAINER_PADDING,
    marginBottom: CARD_MARGIN * 1.2, // More space below search
    ...baseShadow,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchBarFocused: {
    borderColor: COLORS.primary + "40", // 25% opacity
  },
  searchText: {
    ...baseText,
    marginLeft: 10,
    color: COLORS.gray,
    fontSize: 14,
  },

  // Sections with better spacing and typography
  section: {
    marginBottom: CARD_MARGIN * 1.8, // More space between sections
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: CONTAINER_PADDING,
    marginBottom: CARD_MARGIN * 0.8, // Tighter spacing
    paddingTop: 8, // Extra top padding for better visual separation
  },
  sectionTitle: {
    ...baseText,
    fontSize: 20, // Slightly larger
    fontWeight: "700", // Slightly bolder
    letterSpacing: -0.3, // Tighter letter spacing
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 15, // Slightly larger for better touch target
    fontWeight: "600", // Slightly bolder
    padding: 6, // Larger touch target
    margin: -6, // Compensate for padding
    borderRadius: 8, // Rounded corners for touch feedback
    overflow: "hidden", // Keep the ripple effect contained
  },

  // Horizontal Scroll
  horizontalScroll: {
    paddingLeft: CONTAINER_PADDING,
  },
  horizontalScrollContent: {
    paddingRight: CONTAINER_PADDING,
  },

  // Match Card with enhanced styling
  matchCard: {
    ...baseCard,
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  matchCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  matchTimeContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  matchTime: {
    ...baseText,
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  matchDate: {
    ...baseText,
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  matchDetails: {
    marginTop: 10,
  },
  matchLocation: {
    ...baseText,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  matchMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  matchLevel: {
    ...baseText,
    fontSize: 14,
    color: COLORS.gray,
  },

  // Buttons with better visual feedback
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12, // Taller for better touch target
    paddingHorizontal: 16, // Wider for better proportions
    borderRadius: 10, // More rounded
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "700", // Bolder text
    fontSize: 15, // Slightly larger
    letterSpacing: 0.3, // Slightly more spaced letters
  },
  // Quick Actions
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: CONTAINER_PADDING,
    marginBottom: CARD_MARGIN,
  },
  quickActionButton: {
    width: "48%",
    ...baseCard,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionText: {
    ...baseText,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // Courts Grid
  courtsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: CONTAINER_PADDING,
  },
  courtCard: {
    width: "48%",
    ...baseCard,
    marginBottom: CARD_MARGIN,
  },
  // Court Card
  courtInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  courtName: {
    ...baseText,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  availableBadge: {
    backgroundColor: "rgba(46, 204, 113, 0.2)",
  },
  occupiedBadge: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
  },
  statusText: {
    ...baseText,
    fontSize: 10,
    fontWeight: "600",
  },
  courtTime: {
    ...baseText,
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 10,
  },

  // Buttons
  bookButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },

  // Tournament Card with enhanced styling
  tournamentCard: {
    ...baseCard,
    width: CARD_WIDTH * 0.9,
    marginRight: CARD_MARGIN,
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  tournamentCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  // Tournament Card
  tournamentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tournamentName: {
    ...baseText,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  tournamentDate: {
    ...baseText,
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 10,
  },
  tournamentBadge: {
    backgroundColor: "rgba(243, 156, 18, 0.2)",
    alignSelf: "flex-start",
  },

  // Ranking with enhanced styling
  rankingContainer: {
    ...baseCard,
    marginHorizontal: CONTAINER_PADDING,
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  rankText: {
    ...baseText,
    fontSize: 14,
    fontWeight: "bold",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    ...baseText,
    fontSize: 14,
    fontWeight: "600",
  },
  playerPoints: {
    ...baseText,
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  trendIndicator: {
    width: 32, // Slightly larger
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1 }],
  },
  trendIndicatorPressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default HomeScreen;
