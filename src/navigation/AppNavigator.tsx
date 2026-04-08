import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import TournamentsScreen from "../screens/TournamentsScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type AppTabParamList = {
  Home: undefined;
  Tournaments: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: "home", inactive: "home-outline" },
  Tournaments: { active: "trophy", inactive: "trophy-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#00D9A6",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#0F1923",
          borderTopColor: "#1E2D3D",
          paddingBottom: 5,
          height: 100,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={{ title: "Torneos" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
