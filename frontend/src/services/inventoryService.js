import api from './api';

const InventoryService = {
  /**
   * Obtiene todos los items del inventario del usuario con posibilidad de filtrado
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise} - Promesa con los items del inventario
   */
  getAllItems: async (filters = {}) => {
    try {
      // Construir query params a partir de los filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/inventory?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener items del inventario:', error);
      throw error;
    }
  },

  /**
   * Obtiene un item del inventario por su ID
   * @param {number} id - ID del item
   * @returns {Promise} - Promesa con el item
   */
  getItemById: async (id) => {
    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener item con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Usa un item del inventario
   * @param {number} id - ID del item a usar
   * @returns {Promise} - Promesa con el resultado de usar el item
   */
  useItem: async (id) => {
    try {
      const response = await api.post(`/inventory/${id}/use`);
      return response.data;
    } catch (error) {
      console.error(`Error al usar item con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene los items activos del usuario
   * @returns {Promise} - Promesa con los items activos
   */
  getActiveItems: async () => {
    try {
      const response = await api.get('/inventory/active');
      return response.data;
    } catch (error) {
      console.error('Error al obtener items activos:', error);
      throw error;
    }
  },

  /**
   * Desactiva un item activo
   * @param {number} id - ID del item a desactivar
   * @returns {Promise} - Promesa con el resultado
   */
  deactivateItem: async (id) => {
    try {
      const response = await api.post(`/inventory/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error(`Error al desactivar item con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Descarta un item del inventario
   * @param {number} id - ID del item a descartar
   * @returns {Promise} - Promesa vacía en caso de éxito
   */
  discardItem: async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al descartar item con ID ${id}:`, error);
      throw error;
    }
  }
};

export default InventoryService;