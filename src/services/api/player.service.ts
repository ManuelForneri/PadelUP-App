import http from '../api';

interface PlayerFilters {
  category?: string;
  level?: string;
  hand?: 'Derecha' | 'Izquierda';
  position?: 'Reves' | 'Drive';
  search?: string;
}

const playerService = {
  /**
   * Obtiene la lista de jugadores con filtros opcionales
   * @param filters Filtros de búsqueda
   */
  async getPlayers(filters: PlayerFilters = {}) {
    try {
      console.log('Iniciando búsqueda con filtros:', filters);
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      // Agregar filtros solo si tienen valor
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
          console.log(`Agregando filtro: ${key}=${value}`);
        }
      });

      const url = `/players?${params.toString()}`;
      console.log('Realizando petición a:', url);
      
      const response = await http.get(url);
      console.log('Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un jugador por su ID
   * @param id ID del jugador
   */
  async getPlayerById(id: string) {
    try {
      const response = await http.get(`/players/${id}`);
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
  async votePlayer(playerId: string, voteType: 'upVotes' | 'downVotes', voterId: string) {
    try {
      const response = await http.post(`/vote/${playerId}`, {
        voteType,
        voterId
      });
      return response.data;
    } catch (error) {
      console.error('Error al votar por el jugador:', error);
      throw error;
    }
  },
};

export default playerService;
