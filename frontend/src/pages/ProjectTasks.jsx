import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Divider,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import api from '../services/api';
import ProjectService from '../services/projectService';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });
  
  // Cargar proyecto y sus tareas
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles del proyecto
        const projectResponse = await ProjectService.getProjectById(projectId);
        setProject(projectResponse);
        
        // Obtener tareas del proyecto usando la ruta correcta
        const tasksResponse = await api.get(`/tasks?project_id=${projectId}`);
        setTasks(tasksResponse.data.items || []);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar proyecto y tareas:', err);
        setError('No se pudo cargar la información del proyecto. Por favor, intenta de nuevo más tarde.');
        
        // Datos de ejemplo en caso de error
        if (!project) {
          setProject({
            id: projectId,
            title: 'Proyecto de ejemplo',
            description: 'Este es un proyecto de ejemplo para mostrar cuando hay un error.',
            status: 'En progreso'
          });
        }
        
        if (tasks.length === 0) {
          setTasks([
            { id: 1, title: 'Tarea de ejemplo 1', completed: false, priority: 'high' },
            { id: 2, title: 'Tarea de ejemplo 2', completed: true, priority: 'medium' },
            { id: 3, title: 'Tarea de ejemplo 3', completed: false, priority: 'low' }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchProjectAndTasks();
    }
  }, [projectId]);
  
  // Manejar cambios en el formulario de tarea
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Crear una nueva tarea
  const handleCreateTask = async () => {
    try {
      // En una implementación real, aquí se enviaría la tarea a la API
      // Por ahora, simplemente la agregamos al estado local
      const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
      const newTask = {
        ...taskForm,
        id: newId,
        completed: false,
        projectId: parseInt(projectId)
      };
      
      setTasks([...tasks, newTask]);
      setOpenDialog(false);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };
  
  // Marcar una tarea como completada/no completada
  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Eliminar una tarea
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Obtener color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado con botón de regreso */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/projects')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {project?.title || 'Detalles del Proyecto'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nueva Tarea
        </Button>
      </Box>
      
      {/* Información del proyecto */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Información del Proyecto
        </Typography>
        <Typography variant="body1" paragraph>
          {project?.description || 'Sin descripción'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={project?.status || 'Sin estado'} 
            color={project?.status === 'Completado' ? 'success' : 'primary'}
          />
          {project?.dueDate && (
            <Typography variant="body2">
              Fecha límite: {new Date(project.dueDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </Paper>
      
      {/* Lista de tareas */}
      <Typography variant="h6" gutterBottom>
        Tareas
      </Typography>
      
      {tasks.length > 0 ? (
        <Paper>
          <List>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        style={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                    secondary={task.description}
                  />
                  <Chip
                    size="small"
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    sx={{ mr: 1 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No hay tareas para este proyecto
          </Typography>
        </Box>
      )}
      
      {/* Diálogo para crear nueva tarea */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Crear Nueva Tarea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={taskForm.title}
            onChange={handleTaskFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={taskForm.description}
            onChange={handleTaskFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Prioridad</InputLabel>
            <Select
              name="priority"
              value={taskForm.priority}
              label="Prioridad"
              onChange={handleTaskFormChange}
            >
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="medium">Media</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="dueDate"
            label="Fecha límite"
            type="date"
            fullWidth
            variant="outlined"
            value={taskForm.dueDate}
            onChange={handleTaskFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateTask} variant="contained" color="primary">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTasks;