import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

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
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
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
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Limpiar datos de autenticación
      SecureStore.deleteItemAsync('userToken').catch(console.error);
      SecureStore.deleteItemAsync('userData').catch(console.error);
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

export { http };
export default api;
