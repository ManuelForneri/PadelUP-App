import api from "../api";

// Tipo para un torneo de la API
export interface Tournament {
  _id: string;
  name: string;
  category: string;
  isMixed: boolean;
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  registrationFee: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Respuesta de la API
export interface TournamentsResponse {
  success: boolean;
  count: number;
  data: Tournament[];
}

const tournamentService = {
  /**
   * Obtiene la lista de todos los torneos
   */
  async getTournaments(): Promise<TournamentsResponse> {
    try {
      console.log("Obteniendo lista de torneos...");
      const response = await api.get<TournamentsResponse>("/tournaments");
      console.log("Torneos obtenidos:", response.data);
      // api.get devuelve la respuesta completa de axios, necesitamos response.data
      return response.data as TournamentsResponse;
    } catch (error) {
      console.error("Error al obtener torneos:", error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un torneo por su ID
   * @param id ID del torneo
   */
  async getTournamentById(id: string) {
    try {
      const response = await api.get(`/tournaments/${id}`);
      // api.get devuelve la respuesta completa de axios, necesitamos response.data
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el torneo con ID ${id}:`, error);
      throw error;
    }
  },
};

export default tournamentService;

