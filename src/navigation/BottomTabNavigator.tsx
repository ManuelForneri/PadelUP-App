import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import HomeScreen from "../screens/home/HomeScreen";
import TorneosScreen from "../screens/tournaments/TorneosScreen";
import RankingScreen from "../screens/ranking/RankingScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

// Definimos los tipos de las pantallas
export type BottomTabParamList = {
  Home: undefined;
  Torneos: undefined;
  Ranking: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  // Padding extra para Android (para que no se superponga con los botones del sistema)
  const paddingBottom = Platform.OS === "android" ? 20 : 8;

  // Estilo flotante para ambas plataformas (iOS y Android)
  const tabBarStyle = {
    backgroundColor: COLORS.backgroundPrimary,
    borderTopWidth: 0, // Sin borde superior
    paddingBottom: paddingBottom,
    paddingTop: 12,
    height: 80,
    // Bordes redondeados en la parte superior para efecto flotante
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // Márgenes horizontales para que no toque los bordes
    marginHorizontal: 10,
    marginBottom: 10,
    // Sombra suave para efecto flotante
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15, // Para Android
    // Borde sutil alrededor
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Color cuando la pestaña está activa
        tabBarActiveTintColor: COLORS.primary,
        // Color cuando la pestaña está inactiva
        tabBarInactiveTintColor: COLORS.gray,
        // Estilos de la barra de pestañas (flotante para ambas plataformas)
        tabBarStyle: tabBarStyle,
        // Estilos del texto de las pestañas
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Pestaña Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña Torneos */}
      <Tab.Screen
        name="Torneos"
        component={TorneosScreen}
        options={{
          tabBarLabel: "Torneos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña Ranking */}
      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          tabBarLabel: "Ranking",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="podium" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña Perfil */}
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
