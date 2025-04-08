import api from './api';

const JournalEntryService = {
  /**
   * Obtiene todas las entradas de un diario específico
   * @param {number} journalId - ID del diario
   * @returns {Promise} - Promesa con las entradas del diario
   */
  getEntriesByJournal: async (journalId) => {
    try {
      const response = await api.get(`/journals/${journalId}/entries`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener entradas del diario ${journalId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene una entrada específica de un diario
   * @param {number} journalId - ID del diario
   * @param {number} entryId - ID de la entrada
   * @returns {Promise} - Promesa con la entrada del diario
   */
  getEntryById: async (journalId, entryId) => {
    try {
      const response = await api.get(`/journals/${journalId}/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener entrada ${entryId} del diario ${journalId}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva entrada en un diario
   * @param {number} journalId - ID del diario
   * @param {Object} entryData - Datos de la entrada a crear
   * @returns {Promise} - Promesa con la entrada creada
   */
  createEntry: async (journalId, entryData) => {
    try {
      const response = await api.post(`/journals/${journalId}/entries`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Error al crear entrada en el diario ${journalId}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza una entrada existente de un diario
   * @param {number} journalId - ID del diario
   * @param {number} entryId - ID de la entrada
   * @param {Object} entryData - Datos actualizados de la entrada
   * @returns {Promise} - Promesa con la entrada actualizada
   */
  updateEntry: async (journalId, entryId, entryData) => {
    try {
      const response = await api.put(`/journals/${journalId}/entries/${entryId}`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar entrada ${entryId} del diario ${journalId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una entrada de un diario
   * @param {number} journalId - ID del diario
   * @param {number} entryId - ID de la entrada a eliminar
   * @returns {Promise} - Promesa vacía en caso de éxito
   */
  deleteEntry: async (journalId, entryId) => {
    try {
      await api.delete(`/journals/${journalId}/entries/${entryId}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar entrada ${entryId} del diario ${journalId}:`, error);
      throw error;
    }
  }
};

export default JournalEntryService;