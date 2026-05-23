import { UserCategory, CourtSide, DominantHand } from "../types/user";

export const CATEGORY_COLORS: Record<UserCategory, string> = {
  PRIMERA: "#FFD700",
  SEGUNDA: "#C0C0C0",
  TERCERA: "#CD7F32",
  CUARTA: "#00D9A6",
  QUINTA: "#007AFF",
  SEXTA: "#8B5CF6",
  SEPTIMA: "#EF4444",
  OCTAVA: "#6B7280",
};

export const CATEGORY_LABELS: Record<UserCategory, string> = {
  PRIMERA: "1ª División",
  SEGUNDA: "2ª División",
  TERCERA: "3ª División",
  CUARTA: "4ª División",
  QUINTA: "5ª División",
  SEXTA: "6ª División",
  SEPTIMA: "7ª División",
  OCTAVA: "8ª División",
};

export const COURT_SIDE_LABELS: Record<CourtSide, string> = {
  DRIVE: "Drive",
  REVES: "Revés",
  AMBOS: "Ambos",
};

export const HAND_LABELS: Record<DominantHand, string> = {
  DERECHA: "Derecha",
  IZQUIERDA: "Izquierda",
};
