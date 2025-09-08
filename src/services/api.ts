import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { Platform } from 'react-native';

// Detectar si estamos en web
const isWeb = Platform.OS === 'web';

// Clase de almacenamiento compatible con web y móvil
class ApiStorage {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Error al acceder a localStorage:', error);
        return null;
      }
    }
    
    // Para móviles, usamos expo-secure-store dinámicamente
    try {
      // Importar dinámicamente para evitar problemas en web
      const { getItemAsync } = require('expo-secure-store');
      return await getItemAsync(key);
    } catch (error) {
      console.warn('Error al acceder a SecureStore:', error);
      return null;
    }
  }
}

const storage = new ApiStorage();

// Configuración de la API
const API_URL = __DEV__
  ? 'https://padelsag-back.onrender.com/api' // Desarrollo
  : 'https://padelsag-back.onrender.com/api'; // Producción

console.log('Configurando API con URL:', API_URL);

// Tiempos de espera en milisegundos
const TIMEOUTS = {
  default: 30000, // 30 segundos para peticiones normales
  upload: 60000, // 60 segundos para subida de archivos
};

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUTS.default,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  async (config) => {
    // No intentar agregar el token para las rutas de autenticación
    if (config.url?.startsWith('/auth/')) {
      return config;
    }

    try {
      const token = await storage.getItem('userToken');
      console.log('Token obtenido para la petición:', token ? '***' : 'No hay token');
      
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token agregado al encabezado de autorización');
      }
      return config;
    } catch (error) {
      console.error('Error al configurar la petición:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error('Error en la respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.log('Error 401 - No autorizado');
      
      // Limpiar datos de autenticación usando el almacenamiento unificado
      try {
        const { deleteItemAsync } = isWeb 
          ? { deleteItemAsync: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); } }
          : await import('expo-secure-store');
        
        await Promise.all([
          deleteItemAsync('userToken'),
          deleteItemAsync('userData')
        ]);
        
        console.log('Datos de autenticación eliminados debido a error 401');
        
        // Redirigir al login si estamos en la web
        if (isWeb && typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } catch (storageError) {
        console.error('Error al limpiar datos de autenticación:', storageError);
      }
      
      // Rechazar con un error más descriptivo
      return Promise.reject(new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'));
    }
    
    return Promise.reject(error);
  }
);

// Funciones auxiliares para métodos HTTP
const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(response => response.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(response => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(response => response.data),
  
  upload: <T = any>(
    url: string, 
    data: FormData, 
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ) => {
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress as any,
      timeout: TIMEOUTS.upload,
    };
    return api.post<T>(url, data, config).then(response => response.data);
  },
};

// Exportar la instancia de axios configurada
export default api;
