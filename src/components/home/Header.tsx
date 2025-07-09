import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Definición de tipos
type HeaderProps = {
  onProfilePress: () => void;
  userName?: string;
};

const Header: React.FC<HeaderProps> = ({
  onProfilePress,
  userName = "Jugador",
}) => {
  const currentDate = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>¡Hola, {userName}!</Text>
        <Text style={styles.subtitle}>Encuentra tu próximo partido</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
      <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
        <Ionicons name="person-circle" size={40} color="#FF5A5F" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#A4A4A4",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#A4A4A4",
    fontWeight: "500",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
