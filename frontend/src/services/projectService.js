import api from './api';

const ProjectService = {
  /**
   * Obtiene todos los proyectos del usuario con posibilidad de filtrado
   * @param {Object} filters - Filtros opcionales (status, priority, etc.)
   * @returns {Promise} - Promesa con los proyectos
   */
  getAllProjects: async (filters = {}) => {
    try {
      // Construir query params a partir de los filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/projects?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un proyecto por su ID
   * @param {number} id - ID del proyecto
   * @returns {Promise} - Promesa con el proyecto
   */
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener proyecto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo proyecto
   * @param {Object} projectData - Datos del proyecto a crear
   * @returns {Promise} - Promesa con el proyecto creado
   */
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      throw error;
    }
  },

  /**
   * Actualiza un proyecto existente
   * @param {number} id - ID del proyecto
   * @param {Object} projectData - Datos actualizados del proyecto
   * @returns {Promise} - Promesa con el proyecto actualizado
   */
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar proyecto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un proyecto
   * @param {number} id - ID del proyecto a eliminar
   * @returns {Promise} - Promesa vacía en caso de éxito
   */
  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar proyecto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cambia el estado de un proyecto
   * @param {number} id - ID del proyecto
   * @param {string} status - Nuevo estado del proyecto
   * @returns {Promise} - Promesa con el proyecto actualizado
   */
  changeProjectStatus: async (id, status) => {
    try {
      const response = await api.patch(`/projects/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado del proyecto con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las tareas asociadas a un proyecto
   * @param {number} id - ID del proyecto
   * @returns {Promise} - Promesa con las tareas del proyecto
   */
  getProjectTasks: async (id) => {
    try {
      const response = await api.get(`/tasks?project_id=${id}`);
      return response.data.items || [];
    } catch (error) {
      console.error(`Error al obtener tareas del proyecto con ID ${id}:`, error);
      throw error;
    }
  }
};

export default ProjectService;