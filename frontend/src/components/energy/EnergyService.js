import api from '../../services/api';

const EnergyService = {
  /**
   * Obtiene las estadísticas de energía del usuario
   * @returns {Promise} - Promesa con los datos de energía
   */
  getEnergyStats: async () => {
    try {
      // Usar la ruta correcta del backend para obtener estadísticas del usuario
      const response = await api.get('/stats/user?refresh_energy=true');
      
      // Extraer y formatear los datos de energía con los nombres de propiedades correctos
      return {
        minEnergy: -100,  // Valores predeterminados que pueden ser ajustados
        maxEnergy: 100,
        currentEnergy: response.data.energy || 0
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de energía:', error);
      // En caso de error, devolver valores predeterminados
      return {
        minEnergy: -100,
        maxEnergy: 100,
        currentEnergy: 0
      };
    }
  }
};

export default EnergyService;