export type UserRole = "PLAYER" | "ADMIN";

export type UserStatus = "PENDING" | "ACTIVE";

export type UserCategory =
  | "PRIMERA"
  | "SEGUNDA"
  | "TERCERA"
  | "CUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SEPTIMA"
  | "OCTAVA";

export type CourtSide = "DRIVE" | "REVES" | "AMBOS";

export type DominantHand = "DERECHA" | "IZQUIERDA";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  photo: string | null;
  google_id: string;
  role: UserRole;
  status: UserStatus;
  category: UserCategory | null;
  court_side: CourtSide | null;
  dominant_hand: DominantHand | null;
  birth_date: string | null;
  phone: string | null;
  points: number;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  profile_completed: boolean;
}

export interface CompleteProfilePayload {
  court_side: CourtSide;
  dominant_hand: DominantHand;
  birth_date: string; // ISO format: YYYY-MM-DD
  phone: string;
}

export interface UpdateUserPayload {
  category?: UserCategory;
  status?: UserStatus;
  role?: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
}
