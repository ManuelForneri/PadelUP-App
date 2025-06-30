// frontend/src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import PlayerSearchScreen from "../screens/players/PlayerSearchScreen";
import { RootStackParamList } from "../../types";
import { ActivityIndicator, View } from "react-native";
import PlayerDetailsScreen from "../screens/players/PlayerDetailsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f8f9fa",
        },
        headerTintColor: "#212529",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: true,
        headerBackTitle: "Atrás",
      }}
    >
      {user ? (
        // Usuario autenticado
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Inicio" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Mi Perfil" }}
          />
          <Stack.Screen
            name="PlayerSearch"
            component={PlayerSearchScreen}
            options={{ title: "Buscar Jugadores" }}
          />
          <Stack.Screen
            name="PlayerDetails"
            component={PlayerDetailsScreen}
            options={{ title: "Detalles del Jugador" }}
          />
        </>
      ) : (
        // Usuario no autenticado
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Registro" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
