// Paleta de colores PadelUP - Basada en tonos de verde
export const COLORS = {
  // Paleta principal (verdes)
  green: {
    50: '#f0f9e8',
    100: '#d9f5cc',
    200: '#b8e8a3',
    300: '#8fd876',
    400: '#79f55e',  // Verde principal
    500: '#70ef4f',
    600: '#65dc47',
    700: '#5bc741',
    800: '#52b338',
    900: '#3e8c2c',
    1000: '#347725',
    1100: '#2b631e',
    1200: '#225017',
    1300: '#173c11',
    1400: '#0e260a',
    1500: '#051503',
  },
  
  // Colores neutros
  neutral: {
    0: '#ffffff',
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    1000: '#000000',
  },
  
  // Colores de estado
  status: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  
  // Alias para compatibilidad
  primary: '#79f55e',
  primaryLight: '#b8e8a3',
  primaryDark: '#3e8c2c',
  
  textPrimary: '#212529',
  textSecondary: '#495057',
  textLight: '#ffffff',
  textDark: '#000000',
  
  backgroundLight: '#f8f9fa',
  backgroundDark: '#212529',
  backgroundPrimary: '#ffffff',
  
  border: '#dee2e6',
  borderDark: '#adb5bd',
} as const;