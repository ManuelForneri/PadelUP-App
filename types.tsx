export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  PlayerSearch: undefined;
  PlayerDetails: { playerId: string };
};

// Tipos para jugadores
export interface Player {
  _id: string;
  id?: string; // Para compatibilidad
  dni: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  category?: string;
  level?: string;
  hand?: string;
  position?: string;
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayerFilters {
  category?: string;
  level?: string;
  hand?: "Derecha" | "Izquierda";
  position?: "Reves" | "Drive";
  search?: string;
}

export interface User {
  _id: string;
  dni: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  category?: string;
  level?: string;
  hand?: string;
  position?: string;
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para los formularios
export interface LoginFormData {
  dniOrEmail: string;
  password: string;
}

export interface RegisterFormData {
  dni: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  password: string;
  repeatPassword: string;
  category?: string;
  level?: string;
  hand?: string;
  position?: string;
  profileImage?: string | null;
}

export interface ProfileFormData {
  dni: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  category?: string;
  level?: string;
  hand?: string;
  position?: string;
  profileImage?: string | null;
}
