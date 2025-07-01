// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

export interface User {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  category: string;
  level: string;
  hand: string;
  position: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (dniOrEmail: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<{
    token: string;
    user: User;
  }>;
  logout: () => Promise<void>;
  updateProfile: (
    userData: Partial<User> & { profileImage?: string | null }
  ) => Promise<void>;
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

  const login = async (dniOrEmail: string, password: string) => {
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

  const register = async (userData: any) => {
    try {
      console.log("Iniciando proceso de registro...");
      const formData = new FormData();

      // Extraer la imagen de perfil y los demás campos
      const { profileImage, ...userFields } = userData;
      console.log("Campos a enviar:", userFields);

      // Agregar campos de texto al formData
      Object.entries(userFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Asegurarse de que las contraseñas no se registren en los logs
          const safeValue = key.toLowerCase().includes("password")
            ? "***"
            : value;
          console.log(`Agregando campo: ${key} = ${safeValue}`);
          formData.append(key, String(value));
        }
      });

      // Agregar la imagen de perfil si existe
      if (profileImage) {
        console.log("Procesando imagen de perfil...");

        // Extraer la extensión del archivo
        const uriParts = profileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = `profile_${Date.now()}.${fileType}`;

        console.log("Datos de la imagen:", {
          uri: profileImage,
          name: fileName,
          type: `image/${fileType}`,
        });

        // Crear un objeto de archivo para la imagen
        const file = {
          uri: profileImage,
          name: fileName,
          type: `image/${fileType}`,
        } as any; // Usando 'as any' temporalmente para evitar problemas de tipo

        formData.append("profileImage", file);
      } else {
        console.log("No se proporcionó imagen de perfil");
      }

      console.log("Enviando datos de registro al servidor...");
      const response = await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        timeout: 30000, // 30 segundos de timeout
      });

      if (response.data.token && response.data.user) {
        const { token, user: userData } = response.data;

        // Guardar token y datos del usuario
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));

        // Configurar el token en las cabeceras de las peticiones futuras
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
        setUser(userData);

        return { token, user: userData };
      } else {
        throw new Error("Respuesta del servidor incompleta");
      }
    } catch (error: any) {
      console.error("Error en el registro:", error);

      // Mejor manejo de errores
      let errorMessage = "Error al registrarse. Por favor, inténtalo de nuevo.";

      if (error.response) {
        // El servidor respondió con un estado de error
        console.error("Error del servidor:", error.response.data);
        errorMessage = error.response.data?.message || errorMessage;

        // Manejar errores de validación específicos
        if (error.response.data?.errors) {
          const validationErrors = Object.values(error.response.data.errors)
            .flat()
            .join("\n");
          errorMessage = validationErrors || errorMessage;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error("No se recibió respuesta del servidor");
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión a Internet.";
      } else {
        // Algo pasó al configurar la petición
        console.error("Error al configurar la petición:", error.message);
        errorMessage = error.message || errorMessage;
      }

      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (
    userData: Partial<User> & { profileImage?: string | null }
  ) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Agregar campos de texto al formData
      if (userData.dni) formData.append("dni", userData.dni);
      if (userData.firstName) formData.append("firstName", userData.firstName);
      if (userData.lastName) formData.append("lastName", userData.lastName);
      if (userData.email) formData.append("email", userData.email);
      if (userData.city) formData.append("city", userData.city);
      if (userData.category) formData.append("category", userData.category);
      if (userData.level) formData.append("level", userData.level);
      if (userData.hand) formData.append("hand", userData.hand);
      if (userData.position) formData.append("position", userData.position);

      // Agregar la imagen si existe
      if (userData.profileImage !== undefined) {
        if (userData.profileImage) {
          const imageUri = userData.profileImage;
          const filename = imageUri.split("/").pop() || "profile.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpg";

          // @ts-ignore - Necesario para React Native
          formData.append("profileImage", {
            uri: imageUri,
            name: filename,
            type,
          });
        } else {
          // Si profileImage es null, indicamos que se debe eliminar la imagen
          formData.append("removeImage", "true");
        }
      }

      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.user) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        await SecureStore.setItemAsync("userData", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error("Error al actualizar el perfil:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar el perfil"
      );
    } finally {
      setIsLoading(false);
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
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
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
