import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Componentes refactorizados
import {
  ProjectHeader,
  ProjectStats,
  TaskList,
  HabitList,
  MaterialList,
  ProjectDialogs
} from '../components/project';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Estados para el proyecto y sus componentes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para diálogos
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openHabitDialog, setOpenHabitDialog] = useState(false);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Estados para formularios
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending'
  });
  
  const [habitForm, setHabitForm] = useState({
    name: '',
    description: '',
    frequency: 'daily'
  });
  
  const [materialForm, setMaterialForm] = useState({
    name: '',
    description: '',
    url: ''
  });
  
  // Obtener datos del proyecto
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles del proyecto
        const projectResponse = await axios.get(`http://localhost:5000/projects/${id}`);
        setProject(projectResponse.data);
        
        // Obtener tareas del proyecto
        const tasksResponse = await axios.get(`http://localhost:5000/projects/${id}/tasks`);
        setTasks(tasksResponse.data.items || []);
        
        // Obtener hábitos del proyecto
        const habitsResponse = await axios.get(`http://localhost:5000/projects/${id}/habits`);
        setHabits(habitsResponse.data.items || []);
        
        // Obtener materiales del proyecto
        const materialsResponse = await axios.get(`http://localhost:5000/projects/${id}/materials`);
        setMaterials(materialsResponse.data.items || []);
        
      } catch (err) {
        console.error('Error al obtener datos del proyecto:', err);
        setError('No se pudieron cargar los datos del proyecto');
        
        // Datos de ejemplo para desarrollo
        setProject({
          id: parseInt(id),
          name: 'Proyecto de Ejemplo',
          description: 'Este es un proyecto de ejemplo para desarrollo',
          due_date: '2023-06-30',
          priority: 'high',
          status: 'in_progress',
          progress: 65,
          created_at: '2023-05-01',
          updated_at: '2023-05-10'
        });
        
        setTasks([
          { id: 1, title: 'Tarea 1', description: 'Descripción de la tarea 1', status: 'completed', due_date: '2023-05-15', priority: 'high' },
          { id: 2, title: 'Tarea 2', description: 'Descripción de la tarea 2', status: 'in_progress', due_date: '2023-05-20', priority: 'medium' },
          { id: 3, title: 'Tarea 3', description: 'Descripción de la tarea 3', status: 'pending', due_date: '2023-05-25', priority: 'low' }
        ]);
        
        setHabits([
          { id: 1, name: 'Hábito 1', description: 'Descripción del hábito 1', frequency: 'daily', streak: 5 },
          { id: 2, name: 'Hábito 2', description: 'Descripción del hábito 2', frequency: 'weekly', streak: 2 }
        ]);
        
        setMaterials([
          { id: 1, name: 'Material 1', description: 'Descripción del material 1', url: 'https://example.com/material1' },
          { id: 2, name: 'Material 2', description: 'Descripción del material 2', url: 'https://example.com/material2' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejar cambio de estado de tarea
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      // Actualizar en el backend
      await axios.patch(`http://localhost:5000/tasks/${taskId}`, { status: newStatus });
      
      // Actualizar en el estado local
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Actualizar progreso del proyecto
      if (project) {
        const completedTasks = tasks.filter(task => 
          task.id === taskId ? newStatus === 'completed' : task.status === 'completed'
        ).length;
        
        const progress = Math.round((completedTasks / tasks.length) * 100);
        setProject({ ...project, progress });
      }
      
    } catch (err) {
      console.error('Error al actualizar estado de tarea:', err);
      alert('Error al actualizar la tarea. Inténtalo de nuevo.');
    }
  };

  // Manejar apertura de diálogo de tarea
  const handleOpenTaskDialog = (task = null) => {
    if (task) {
      setTaskForm({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending'
      });
      setEditingItem(task);
    } else {
      setTaskForm({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        status: 'pending'
      });
      setEditingItem(null);
    }
    setOpenTaskDialog(true);
  };

  // Manejar apertura de diálogo de hábito
  const handleOpenHabitDialog = (habit = null) => {
    if (habit) {
      setHabitForm({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency || 'daily'
      });
      setEditingItem(habit);
    } else {
      setHabitForm({
        name: '',
        description: '',
        frequency: 'daily'
      });
      setEditingItem(null);
    }
    setOpenHabitDialog(true);
  };

  // Manejar apertura de diálogo de material
  const handleOpenMaterialDialog = (material = null) => {
    if (material) {
      setMaterialForm({
        name: material.name,
        description: material.description || '',
        url: material.url || ''
      });
      setEditingItem(material);
    } else {
      setMaterialForm({
        name: '',
        description: '',
        url: ''
      });
      setEditingItem(null);
    }
    setOpenMaterialDialog(true);
  };

  // Manejar cierre de diálogos
  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setEditingItem(null);
  };

  const handleCloseHabitDialog = () => {
    setOpenHabitDialog(false);
    setEditingItem(null);
  };

  const handleCloseMaterialDialog = () => {
    setOpenMaterialDialog(false);
    setEditingItem(null);
  };

  // Manejar cambios en formularios
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleHabitFormChange = (e) => {
    const { name, value } = e.target;
    setHabitForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMaterialFormChange = (e) => {
    const { name, value } = e.target;
    setMaterialForm(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío de formularios
  const handleSubmitTask = async () => {
    try {
      // Validar campos requeridos
      if (!taskForm.title) {
        alert('Por favor ingresa un título para la tarea');
        return;
      }
      
      const taskData = {
        ...taskForm,
        project_id: project.id
      };
      
      let response;
      
      if (editingItem) {
        // Actualizar tarea existente
        response = await axios.put(`http://localhost:5000/tasks/${editingItem.id}`, taskData);
        
        // Actualizar en el estado local
        setTasks(tasks.map(task => 
          task.id === editingItem.id ? { ...task, ...taskData } : task
        ));
      } else {
        // Crear nueva tarea
        response = await axios.post('http://localhost:5000/tasks', taskData);
        
        // Añadir a la lista local
        setTasks([...tasks, response.data]);
      }
      
      // Cerrar diálogo
      handleCloseTaskDialog();
      
    } catch (err) {
      console.error('Error al guardar tarea:', err);
      alert('Error al guardar la tarea. Inténtalo de nuevo.');
    }
  };

  const handleSubmitHabit = async () => {
    try {
      // Validar campos requeridos
      if (!habitForm.name) {
        alert('Por favor ingresa un nombre para el hábito');
        return;
      }
      
      const habitData = {
        ...habitForm,
        project_id: project.id
      };
      
      let response;
      
      if (editingItem) {
        // Actualizar hábito existente
        response = await axios.put(`http://localhost:5000/habits/${editingItem.id}`, habitData);
        
        // Actualizar en el estado local
        setHabits(habits.map(habit => 
          habit.id === editingItem.id ? { ...habit, ...habitData } : habit
        ));
      } else {
        // Crear nuevo hábito
        response = await axios.post('http://localhost:5000/habits', habitData);
        
        // Añadir a la lista local
        setHabits([...habits, response.data]);
      }
      
      // Cerrar diálogo
      handleCloseHabitDialog();
      
    } catch (err) {
      console.error('Error al guardar hábito:', err);
      alert('Error al guardar el hábito. Inténtalo de nuevo.');
    }
  };

  const handleSubmitMaterial = async () => {
    try {
      // Validar campos requeridos
      if (!materialForm.name) {
        alert('Por favor ingresa un nombre para el material');
        return;
      }
      
      const materialData = {
        ...materialForm,
        project_id: project.id
      };
      
      let response;
      
      if (editingItem) {
        // Actualizar material existente
        response = await axios.put(`http://localhost:5000/materials/${editingItem.id}`, materialData);
        
        // Actualizar en el estado local
        setMaterials(materials.map(material => 
          material.id === editingItem.id ? { ...material, ...materialData } : material
        ));
      } else {
        // Crear nuevo material
        response = await axios.post('http://localhost:5000/materials', materialData);
        
        // Añadir a la lista local
        setMaterials([...materials, response.data]);
      }
      
      // Cerrar diálogo
      handleCloseMaterialDialog();
      
    } catch (err) {
      console.error('Error al guardar material:', err);
      alert('Error al guardar el material. Inténtalo de nuevo.');
    }
  };

  // Manejar eliminación
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      alert('Error al eliminar la tarea. Inténtalo de nuevo.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este hábito?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/habits/${habitId}`);
      setHabits(habits.filter(habit => habit.id !== habitId));
    } catch (err) {
      console.error('Error al eliminar hábito:', err);
      alert('Error al eliminar el hábito. Inténtalo de nuevo.');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este material?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/materials/${materialId}`);
      setMaterials(materials.filter(material => material.id !== materialId));
    } catch (err) {
      console.error('Error al eliminar material:', err);
      alert('Error al eliminar el material. Inténtalo de nuevo.');
    }
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Encabezado del proyecto */}
      <ProjectHeader project={project} onEdit={() => {}} />
      
      {/* Estadísticas del proyecto */}
      <ProjectStats project={project} tasks={tasks} />
      
      {/* Pestañas para tareas, hábitos y materiales */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`Tareas (${tasks.length})`} />
          <Tab label={`Hábitos (${habits.length})`} />
          <Tab label={`Materiales (${materials.length})`} />
        </Tabs>
      </Paper>
      
      {/* Contenido de las pestañas */}
      <Box sx={{ mt: 2 }}>
        {/* Pestaña de tareas */}
        {tabValue === 0 && (
          <TaskList
            tasks={tasks}
            onAddTask={() => handleOpenTaskDialog()}
            onEditTask={handleOpenTaskDialog}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleTaskStatusChange}
          />
        )}
        
        {/* Pestaña de hábitos */}
        {tabValue === 1 && (
          <HabitList
            habits={habits}
            onAddHabit={() => handleOpenHabitDialog()}
            onEditHabit={handleOpenHabitDialog}
            onDeleteHabit={handleDeleteHabit}
          />
        )}
        
        {/* Pestaña de materiales */}
        {tabValue === 2 && (
          <MaterialList
            materials={materials}
            onAddMaterial={() => handleOpenMaterialDialog()}
            onEditMaterial={handleOpenMaterialDialog}
            onDeleteMaterial={handleDeleteMaterial}
          />
        )}
      </Box>
      
      {/* Diálogos */}
      <ProjectDialogs.TaskDialog
        open={openTaskDialog}
        onClose={handleCloseTaskDialog}
        taskForm={taskForm}
        onChange={handleTaskFormChange}
        onSubmit={handleSubmitTask}
        editingItem={editingItem}
      />
      
      <ProjectDialogs.HabitDialog
        open={openHabitDialog}
        onClose={handleCloseHabitDialog}
        habitForm={habitForm}
        onChange={handleHabitFormChange}
        onSubmit={handleSubmitHabit}
        editingItem={editingItem}
      />
      
      <ProjectDialogs.MaterialDialog
        open={openMaterialDialog}
        onClose={handleCloseMaterialDialog}
        materialForm={materialForm}
        onChange={handleMaterialFormChange}
        onSubmit={handleSubmitMaterial}
        editingItem={editingItem}
      />
    </Box>
  );
};

export default ProjectDetail;