import api from './api';

const JournalService = {
  /**
   * Obtiene todos los diarios del usuario con posibilidad de filtrado
   * @param {Object} filters - Filtros opcionales (from_date, to_date, type)
   * @returns {Promise} - Promesa con los diarios
   */
  getAllJournals: async (filters = {}) => {
    try {
      // Construir query params a partir de los filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/journals?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener diarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene el diario de hoy o lo crea si no existe
   * @returns {Promise} - Promesa con el diario de hoy
   */
  getJournalToday: async () => {
    try {
      const response = await api.get('/journals/today');
      return response.data;
    } catch (error) {
      console.error('Error al obtener diario de hoy:', error);
      throw error;
    }
  },

  /**
   * Obtiene un diario por su ID
   * @param {number} id - ID del diario
   * @returns {Promise} - Promesa con el diario
   */
  getJournalById: async (id) => {
    try {
      const response = await api.get(`/journals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener diario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo diario
   * @param {Object} journalData - Datos del diario a crear
   * @returns {Promise} - Promesa con el diario creado
   */
  createJournal: async (journalData) => {
    try {
      const response = await api.post('/journals', journalData);
      return response.data;
    } catch (error) {
      console.error('Error al crear diario:', error);
      throw error;
    }
  },

  /**
   * Actualiza un diario existente
   * @param {number} id - ID del diario
   * @param {Object} journalData - Datos actualizados del diario
   * @returns {Promise} - Promesa con el diario actualizado
   */
  updateJournal: async (id, journalData) => {
    try {
      const response = await api.put(`/journals/${id}`, journalData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar diario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un diario
   * @param {number} id - ID del diario a eliminar
   * @returns {Promise} - Promesa vacía en caso de éxito
   */
  deleteJournal: async (id) => {
    try {
      await api.delete(`/journals/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar diario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de un diario
   * @param {number} id - ID del diario
   * @param {Object} params - Parámetros adicionales (from_date, to_date)
   * @returns {Promise} - Promesa con las estadísticas
   */
  getJournalStats: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/journals/${id}/stats?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener estadísticas del diario con ID ${id}:`, error);
      throw error;
    }
  }
};

export default JournalService;