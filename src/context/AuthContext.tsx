// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

interface User {
  id: string;
  username: string;
  email: string;
  category?: string;
  level?: string;
  hand?: string;
  position?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        const storedUser = await SecureStore.getItemAsync("userData");

        if (storedToken && storedUser) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al cargar los datos de autenticación:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        usernameOrEmail,
        password,
      });
      const { token, user } = response.data;

      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";
      throw new Error(errorMessage);
    }
  };

  // En el método register del AuthContext
  const register = async (userData: any) => {
    try {
      console.log('Iniciando proceso de registro...');
      const formData = new FormData();

      // Agregar campos de texto
      const { profileImage, repeatPassword, ...userFields } = userData;
      console.log('Campos de texto a enviar:', userFields);
      
      // Agregar campos de texto al formData
      Object.entries(userFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Agregar la imagen si existe
      if (profileImage) {
        console.log('Procesando imagen de perfil...');
        const imageUri = profileImage;
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpg';

        // Crear un objeto de archivo para React Native
        const file = {
          uri: imageUri,
          name: filename,
          type: type,
        };

        console.log('Datos de la imagen:', { filename, type });
        
        // Agregar la imagen al formData
        // @ts-ignore - Necesario para React Native
        formData.append('image', file);
      }

      console.log('Enviando datos de registro al servidor...');
      
      // Realizar la petición
      const response = await api.post("/auth/register", formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del servidor recibida:', response.data);

      const { token, user } = response.data;

      // Guardar token y datos del usuario
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));

      // Configurar el token en las cabeceras de las peticiones futuras
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      
      return response.data;
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Mejor manejo de errores
      let errorMessage = 'Error al registrarse. Por favor, inténtalo de nuevo.';
      
      if (error.response) {
        // El servidor respondió con un estado de error
        console.error('Error del servidor:', error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error('No se recibió respuesta del servidor');
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a Internet.';
      } else {
        // Algo pasó al configurar la petición
        console.error('Error al configurar la petición:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");

      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
