import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "./colors";

const { width, height } = Dimensions.get("window");

// Tipografía
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.green[900],
    marginBottom: 10,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.green[900],
    marginBottom: 8,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.green[900],
    marginBottom: 6,
  },
  body1: {
    fontSize: 16,
    color: COLORS.neutral[700],
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    color: COLORS.neutral[600],
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.neutral[0],
    textAlign: "center",
  },
  caption: {
    fontSize: 12,
    color: COLORS.neutral[500],
  },
  label: {
    fontSize: 14,
    color: COLORS.green[900],
    marginBottom: 4,
    fontWeight: "500",
  },
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
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
    backgroundColor: COLORS.neutral[50],
  },
  section: {
    marginBottom: 24,
  },
};

// Componentes comunes
export const COMPONENTS = {
  card: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.medium,
    padding: LAYOUT.spacing.md,
    ...SHADOWS.small,
  },
  button: {
    primary: {
      backgroundColor: COLORS.green[400],
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: BORDERS.radius.medium,
      ...SHADOWS.small,
    },
    secondary: {
      backgroundColor: COLORS.green[600],
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: BORDERS.radius.medium,
      ...SHADOWS.small,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: BORDERS.width.regular,
      borderColor: COLORS.green[400],
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: BORDERS.radius.medium,
    },
    disabled: {
      backgroundColor: COLORS.neutral[300],
      opacity: 0.7,
    },
  },
  input: {
    backgroundColor: COLORS.neutral[0],
    borderWidth: BORDERS.width.regular,
    borderColor: COLORS.neutral[200],
    borderRadius: BORDERS.radius.medium,
    padding: 12,
    fontSize: 16,
    color: COLORS.neutral[900],
    ...SHADOWS.small,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BORDERS.radius.full,
    backgroundColor: COLORS.neutral[200],
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  chip: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: BORDERS.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral[700],
  },
};

// Estilos globales
export const GLOBAL_STYLES = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  containerWhite: {
    flex: 1,
    backgroundColor: COLORS.neutral[0],
  },
  scrollContainer: {
    flexGrow: 1,
    padding: LAYOUT.spacing.md,
  },

  // Encabezados
  header: {
    ...TYPOGRAPHY.h1,
    color: COLORS.green[800],
    marginBottom: LAYOUT.spacing.lg,
  },
  subheader: {
    ...TYPOGRAPHY.h2,
    color: COLORS.green[700],
    marginBottom: LAYOUT.spacing.md,
  },

  // Textos
  text: {
    ...TYPOGRAPHY.body1,
    color: COLORS.neutral[800],
  },
  textMuted: {
    ...TYPOGRAPHY.body2,
    color: COLORS.neutral[600],
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },

  // Utilidades
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  fullWidth: {
    width: "100%",
  },
  selfCenter: {
    alignSelf: "center",
  },
  selfEnd: {
    alignSelf: "flex-end",
  },

  // Márgenes
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
  mrSm: {
    marginRight: LAYOUT.spacing.sm,
  },
  mrMd: {
    marginRight: LAYOUT.spacing.md,
  },
  mvSm: {
    marginVertical: LAYOUT.spacing.sm,
  },
  mvMd: {
    marginVertical: LAYOUT.spacing.md,
  },
  mhSm: {
    marginHorizontal: LAYOUT.spacing.sm,
  },
  mhMd: {
    marginHorizontal: LAYOUT.spacing.md,
  },

  // Paddings
  pSm: {
    padding: LAYOUT.spacing.sm,
  },
  pMd: {
    padding: LAYOUT.spacing.md,
  },
  pLg: {
    padding: LAYOUT.spacing.lg,
  },
  pvSm: {
    paddingVertical: LAYOUT.spacing.sm,
  },
  pvMd: {
    paddingVertical: LAYOUT.spacing.md,
  },
  phSm: {
    paddingHorizontal: LAYOUT.spacing.sm,
  },
  phMd: {
    paddingHorizontal: LAYOUT.spacing.md,
  },

  // Bordes
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.neutral[200],
  },
  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.neutral[200],
  },

  // Sombras
  shadowSm: {
    ...SHADOWS.small,
  },
  shadowMd: {
    ...SHADOWS.medium,
  },
  shadowLg: {
    ...SHADOWS.large,
  },

  // Fondo
  bgPrimary: {
    backgroundColor: COLORS.green[400],
  },
  bgLight: {
    backgroundColor: COLORS.neutral[50],
  },
  bgWhite: {
    backgroundColor: COLORS.neutral[0],
  },

  // Texto
  textPrimary: {
    color: COLORS.green[800],
  },
  textSecondary: {
    color: COLORS.neutral[600],
  },
  textLight: {
    color: COLORS.neutral[0],
  },
  textDark: {
    color: COLORS.neutral[900],
  },

  // Botones
  buttonRounded: {
    borderRadius: 24,
  },

  // Tarjetas
  card: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.medium,
    padding: LAYOUT.spacing.md,
    ...SHADOWS.small,
  },

  // Formularios
  formGroup: {
    marginBottom: LAYOUT.spacing.md,
  },

  // Avatar
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.neutral[200],
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  // Badges
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.green[100],
    alignSelf: "flex-start",
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.green[800],
    fontWeight: "600",
  },

  // Separadores
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.neutral[200],
    marginVertical: LAYOUT.spacing.md,
  },

  // Imágenes
  imageCover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageContain: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
  Dimensions.get("window");

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
