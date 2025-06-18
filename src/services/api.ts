// frontend/src/services/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Determinar la URL base según el entorno
const API_URL = __DEV__
  ? "http://192.168.100.5:5000/api" // Usando la IP local
  : "https://tudominio.com/api"; // URL de producción

console.log("Configurando API con URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Aumentar el timeout para peticiones con imágenes
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Configuración global de Axios para manejar CORS
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

// Interceptor para manejar las peticiones salientes
api.interceptors.request.use(
  async (config) => {
    try {
      // Agregar token de autenticación si existe
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Manejar FormData para subida de archivos
      if (config.data instanceof FormData) {
        // Eliminar Content-Type para que Axios lo establezca automáticamente con el boundary correcto
        delete config.headers['Content-Type'];
        
        // Configuración específica para FormData
        config.transformRequest = (data, headers) => {
          // No modificar los headers aquí, Axios los manejará automáticamente
          return data;
        };
      }

      // Log de la petición para depuración
      console.log(`[${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
      if (config.data && !(config.data instanceof FormData)) {
        console.log('Datos enviados:', config.data);
      } else if (config.data instanceof FormData) {
        console.log('Enviando FormData con archivo adjunto');
      }

      return config;
    } catch (error) {
      console.error('Error en el interceptor de solicitud:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error en la configuración de la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar las respuestas
api.interceptors.response.use(
  (response) => {
    console.log(`[${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      request: error.request ? 'Request made but no response received' : 'Error setting up request'
    });
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log("Respuesta recibida de:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error("Error en la respuesta:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      // Token expirado o inválido
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
      // Opcional: Redirigir al login
    }

    return Promise.reject(error);
  }
);

export default api;
