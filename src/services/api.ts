import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, CompleteProfilePayload, UpdateUserPayload } from "../types/user";
import { Tournament } from "../types/tournament";

const API_BASE_URL = "https://overformed-laverne-nondiffuse.ngrok-free.dev";

export const TOKEN_KEY = "@padelup_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Auth Endpoints ────────────────────────────────────────────────────────────

/**
 * Returns the URL to open in the browser for Google OAuth.
 * The backend redirects to padelup://auth/callback?token=<jwt> after success.
 */
export const getGoogleAuthUrl = (): string => `${API_BASE_URL}/auth/google`;

/** Fetch the authenticated user's data (requires valid JWT). */
export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};

// ─── User Endpoints ────────────────────────────────────────────────────────────

/** Complete the user profile (step 2 of registration). */
export const completeProfile = async (
  payload: CompleteProfilePayload,
): Promise<User> => {
  const response = await api.patch<User>("/users/me/profile", payload);
  return response.data;
};

/** [ADMIN] Get all users. */
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

/** [ADMIN] Get a single user by ID. */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

/** [ADMIN] Update a user (assign category, role, status, etc.). */
export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, payload);
  return response.data;
};

/** [ADMIN] Delete a user. */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// ─── Tournaments Endpoints ─────────────────────────────────────────────────────

/** Fetch all tournaments from the database. */
export const getTournaments = async (): Promise<Tournament[]> => {
  const response = await api.get<Tournament[]>("/tournaments");
  return response.data;
};

export default api;
