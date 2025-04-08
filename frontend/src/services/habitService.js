import api from './api';

const HabitService = {
  /**
   * Obtiene todos los hábitos del usuario con posibilidad de filtrado
   * @param {Object} filters - Filtros opcionales (active, frequency, etc.)
   * @returns {Promise} - Promesa con los hábitos
   */
  getAllHabits: async (filters = {}) => {
    try {
      // Construir query params a partir de los filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/habits?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener hábitos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un hábito por su ID
   * @param {number} id - ID del hábito
   * @returns {Promise} - Promesa con el hábito
   */
  getHabitById: async (id) => {
    try {
      const response = await api.get(`/habits/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener hábito con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo hábito
   * @param {Object} habitData - Datos del hábito a crear
   * @returns {Promise} - Promesa con el hábito creado
   */
  createHabit: async (habitData) => {
    try {
      const response = await api.post('/habits', habitData);
      return response.data;
    } catch (error) {
      console.error('Error al crear hábito:', error);
      throw error;
    }
  },

  /**
   * Actualiza un hábito existente
   * @param {number} id - ID del hábito
   * @param {Object} habitData - Datos actualizados del hábito
   * @returns {Promise} - Promesa con el hábito actualizado
   */
  updateHabit: async (id, habitData) => {
    try {
      const response = await api.put(`/habits/${id}`, habitData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar hábito con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un hábito
   * @param {number} id - ID del hábito a eliminar
   * @returns {Promise} - Promesa vacía en caso de éxito
   */
  deleteHabit: async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar hábito con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Marca un hábito como completado o no completado
   * @param {number} id - ID del hábito
   * @param {boolean} completed - Estado de completado
   * @returns {Promise} - Promesa con el hábito actualizado
   */
  toggleHabitCompletion: async (id, completed) => {
    try {
      const response = await api.post(`/habits/${id}/toggle`, { completed });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado del hábito con ID ${id}:`, error);
      throw error;
    }
  }
};

export default HabitService;