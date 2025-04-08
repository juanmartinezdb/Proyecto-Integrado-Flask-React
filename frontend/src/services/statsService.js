import api from './api';

const StatsService = {
  /**
   * Obtiene las estadísticas de energía del usuario
   * @returns {Promise} - Promesa con los datos de energía
   */
  getEnergyStats: async () => {
    try {
      const response = await api.get('/stats/user?refresh_energy=true');
      return {
        min_energy: -100,  // Valores predeterminados que pueden ser ajustados
        max_energy: 100,
        current_energy: response.data.energy || 0
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de energía:', error);
      throw error;
    }
  },

  /**
   * Obtiene las estadísticas generales del usuario
   * @param {boolean} refreshEnergy - Indica si se debe recalcular la energía
   * @returns {Promise} - Promesa con las estadísticas del usuario
   */
  getUserStats: async (refreshEnergy = false) => {
    try {
      const response = await api.get(`/stats/user?refresh_energy=${refreshEnergy}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene las estadísticas de una zona específica
   * @param {number} zoneId - ID de la zona
   * @param {boolean} refreshEnergy - Indica si se debe recalcular la energía
   * @returns {Promise} - Promesa con las estadísticas de la zona
   */
  getZoneStats: async (zoneId, refreshEnergy = false) => {
    try {
      const response = await api.get(`/stats/zone/${zoneId}?refresh_energy=${refreshEnergy}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener estadísticas de la zona ${zoneId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene el historial de estadísticas
   * @param {string} type - Tipo de estadística (energy, xp, level)
   * @param {number} daysBack - Número de días hacia atrás
   * @returns {Promise} - Promesa con el historial de estadísticas
   */
  getStatsHistory: async (type = 'energy', daysBack = 7) => {
    try {
      const response = await api.get(`/stats/history?type=${type}&days_back=${daysBack}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de estadísticas:', error);
      throw error;
    }
  }
};

export default StatsService;