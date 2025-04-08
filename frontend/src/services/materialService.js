import api from './api';

const MaterialService = {
  /**
   * Obtiene todos los materiales del usuario con posibilidad de filtrado
   * @param {Object} filters - Filtros opcionales (type, query, project_id)
   * @returns {Promise} - Promesa con los materiales
   */
  getAllMaterials: async (filters = {}) => {
    try {
      // Construir query params a partir de los filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/materials?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      throw error;
    }
  },

  /**
   * Obtiene un material por su ID
   * @param {number} id - ID del material
   * @returns {Promise} - Promesa con el material
   */
  getMaterialById: async (id) => {
    try {
      const response = await api.get(`/materials/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener material con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo material
   * @param {Object} materialData - Datos del material a crear
   * @returns {Promise} - Promesa con el material creado
   */
  createMaterial: async (materialData) => {
    try {
      const response = await api.post('/materials', materialData);
      return response.data;
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  },

  /**
   * Actualiza un material existente
   * @param {number} id - ID del material
   * @param {Object} materialData - Datos actualizados del material
   * @returns {Promise} - Promesa con el material actualizado
   */
  updateMaterial: async (id, materialData) => {
    try {
      const response = await api.put(`/materials/${id}`, materialData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar material con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un material
   * @param {number} id - ID del material a eliminar
   * @returns {Promise} - Promesa vacía en caso de éxito
   */
  deleteMaterial: async (id) => {
    try {
      await api.delete(`/materials/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar material con ID ${id}:`, error);
      throw error;
    }
  }
};

export default MaterialService;