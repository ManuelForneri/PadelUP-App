import api from "../api";

interface PlayerFilters {
  category?: string;
  level?: string;
  hand?: "Derecha" | "Izquierda";
  position?: "Reves" | "Drive";
  search?: string;
}

const playerService = {
  /**
   * Obtiene la lista de jugadores con filtros opcionales
   * @param filters Filtros de búsqueda
   */
  async getPlayers(filters: PlayerFilters = {}) {
    try {
      console.log("Iniciando búsqueda con filtros:", filters);

      // Construir objeto de parámetros
      const params: Record<string, string> = {};

      // Mapear los filtros al formato esperado por el backend
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.hand) params.hand = filters.hand;
      if (filters.position) params.position = filters.position;

      console.log("Parámetros de búsqueda:", params);

      // Usar la instancia de api que ya tiene los interceptores configurados
      const response = await api.get("/players", { params });

      // Verificar la respuesta
      if (!response.data) {
        throw new Error("No se recibieron datos en la respuesta");
      }
      console.log("Respuesta recibida:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener jugadores:", error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un jugador por su ID
   * @param id ID del jugador
   */
  async getPlayerById(id: string) {
    try {
      const response = await api.get(`/players/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el jugador con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Vota por un jugador
   * @param playerId ID del jugador a votar
   * @param voteType Tipo de voto ('upVotes' o 'downVotes')
   * @param voterId ID del usuario que está votando
   */
  async votePlayer(
    playerId: string,
    voteType: "goodVotes" | "passVotes",
    voterId: string
  ) {
    try {
      const response = await api.post(`/votes/${playerId}`, {
        voteType,
        voterId,
      });
      return response.data;
    } catch (error) {
      console.error("Error al votar por el jugador:", error);
      throw error;
    }
  },
};

export default playerService;
