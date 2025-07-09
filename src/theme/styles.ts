import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Paleta de colores principal
export const COLORS = {
  primary: '#FF5A5F',    // Rojo coral - Color principal
  secondary: '#00A699',  // Verde agua - Color secundario
  accent: '#FFC107',     // Amarillo - Para destacar elementos
  dark: '#2D3436',       // Gris oscuro - Para texto principal
  light: '#F7F9F9',      // Gris muy claro - Para fondos
  white: '#FFFFFF',      // Blanco puro
  gray: '#A4A4A4',       // Gris medio - Para texto secundario
  lightGray: '#E0E0E0',  // Gris claro - Para bordes y separadores
  error: '#E74C3C',      // Rojo - Para errores
  success: '#2ECC71',    // Verde - Para éxito
  warning: '#F39C12',    // Naranja - Para advertencias
  info: '#3498DB',       // Azul - Para información
};

// Tipografía
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 6,
  },
  body1: {
    fontSize: 16,
    color: COLORS.dark,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  caption: {
    fontSize: 12,
    color: COLORS.gray,
  },
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Bordes
const BORDERS = {
  radius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
    full: 9999,
  },
  width: {
    thin: StyleSheet.hairlineWidth,
    regular: 1,
    thick: 2,
  },
};

// Layout
const LAYOUT = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.light,
  },
  section: {
    marginBottom: 24,
  },
};

// Componentes comunes
export const COMPONENTS = {
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDERS.radius.medium,
    padding: LAYOUT.spacing.md,
    ...SHADOWS.small,
  },
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: BORDERS.radius.medium,
      ...SHADOWS.small,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: BORDERS.radius.medium,
      ...SHADOWS.small,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: BORDERS.width.regular,
      borderColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: BORDERS.radius.medium,
    },
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: BORDERS.width.regular,
    borderColor: COLORS.lightGray,
    borderRadius: BORDERS.radius.medium,
    padding: 12,
    fontSize: 16,
    color: COLORS.dark,
    ...SHADOWS.small,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BORDERS.radius.full,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
};

// Estilos globales
export const GLOBAL_STYLES = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  containerWhite: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: LAYOUT.spacing.md,
  },
  
  // Encabezados
  header: {
    ...TYPOGRAPHY.h1,
    marginBottom: LAYOUT.spacing.lg,
  },
  subheader: {
    ...TYPOGRAPHY.h2,
    marginBottom: LAYOUT.spacing.md,
  },
  
  // Textos
  text: {
    ...TYPOGRAPHY.body1,
  },
  textMuted: {
    ...TYPOGRAPHY.body2,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  
  // Utilidades
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mbSm: {
    marginBottom: LAYOUT.spacing.sm,
  },
  mbMd: {
    marginBottom: LAYOUT.spacing.md,
  },
  mbLg: {
    marginBottom: LAYOUT.spacing.lg,
  },
  mtSm: {
    marginTop: LAYOUT.spacing.sm,
  },
  mtMd: {
    marginTop: LAYOUT.spacing.md,
  },
  mtLg: {
    marginTop: LAYOUT.spacing.lg,
  },
  mlSm: {
    marginLeft: LAYOUT.spacing.sm,
  },
  mlMd: {
    marginLeft: LAYOUT.spacing.md,
  },
  pSm: {
    padding: LAYOUT.spacing.sm,
  },
  pMd: {
    padding: LAYOUT.spacing.md,
  },
  pLg: {
    padding: LAYOUT.spacing.lg,
  },
});

export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

export const CARD_WIDTH = width * 0.9;
export const CARD_MARGIN = 10;

export default {
  COLORS,
  TYPOGRAPHY,
  SHADOWS,
  BORDERS,
  LAYOUT,
  COMPONENTS,
  GLOBAL_STYLES,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  CARD_WIDTH,
  CARD_MARGIN,
};
