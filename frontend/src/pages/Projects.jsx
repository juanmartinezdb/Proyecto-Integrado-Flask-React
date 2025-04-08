import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Chip,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  Drawer
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Assignment as TaskIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';
import ProjectService from '../services/projectService';
import api from '../services/api';

const Projects = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estados para mostrar tareas del proyecto seleccionado
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState(null);
  const [showTasks, setShowTasks] = useState(false);
  
  // Estado para el formulario de proyecto
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    status: 'Iniciado',
    dueDate: new Date().toISOString().split('T')[0]
  });
  
  // Estado para el formulario de tarea
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  // Cargar proyectos desde la API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await ProjectService.getAllProjects();
      setProjects(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      setError('Error al cargar los proyectos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar tareas de un proyecto específico
  const fetchProjectTasks = async (projectId) => {
    try {
      setLoadingTasks(true);
      setTaskError(null);
      
      // Obtener tareas del proyecto usando la ruta correcta
      const tasksResponse = await api.get(`/tasks?project_id=${projectId}`);
      setSelectedProjectTasks(tasksResponse.data.items || []);
      
      // Mostrar el panel de tareas
      setShowTasks(true);
    } catch (error) {
      console.error(`Error al cargar tareas del proyecto ${projectId}:`, error);
      setTaskError('No se pudieron cargar las tareas del proyecto.');
      // Datos de ejemplo en caso de error
      setSelectedProjectTasks([
        { id: 1, title: 'Tarea de ejemplo 1', completed: false, priority: 'high' },
        { id: 2, title: 'Tarea de ejemplo 2', completed: true, priority: 'medium' },
        { id: 3, title: 'Tarea de ejemplo 3', completed: false, priority: 'low' }
      ]);
    } finally {
      setLoadingTasks(false);
    }
  };
  
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
      const newId = Math.max(...selectedProjectTasks.map(t => t.id), 0) + 1;
      const newTask = {
        ...taskForm,
        id: newId,
        completed: false,
        projectId: parseInt(selectedProject.id)
      };
      
      setSelectedProjectTasks([...selectedProjectTasks, newTask]);
      setOpenTaskDialog(false);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
      
      setSnackbarMessage('Tarea creada correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      setSnackbarMessage('Error al crear la tarea');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Marcar una tarea como completada/no completada
  const handleToggleComplete = (taskId) => {
    setSelectedProjectTasks(selectedProjectTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Eliminar una tarea
  const handleDeleteTask = (taskId) => {
    setSelectedProjectTasks(selectedProjectTasks.filter(task => task.id !== taskId));
    setSnackbarMessage('Tarea eliminada correctamente');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };
  
  // Obtener color según prioridad de la tarea
  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Abrir diálogo para crear/editar proyecto
  const handleOpenDialog = (project = null) => {
    if (project) {
      setSelectedProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        status: project.status,
        dueDate: project.dueDate
      });
    } else {
      setSelectedProject(null);
      setProjectForm({
        title: '',
        description: '',
        status: 'Iniciado',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar un proyecto (crear o actualizar)
  const handleSaveProject = async () => {
    try {
      if (selectedProject) {
        // Actualizar proyecto existente
        const updatedProject = await ProjectService.updateProject(selectedProject.id, projectForm);
        setProjects(projects.map(p => 
          p.id === selectedProject.id ? updatedProject : p
        ));
        setSnackbarMessage('Proyecto actualizado correctamente');
      } else {
        // Crear nuevo proyecto
        const newProject = await ProjectService.createProject(projectForm);
        setProjects([...projects, newProject]);
        setSnackbarMessage('Proyecto creado correctamente');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      setSnackbarMessage('Error al guardar el proyecto');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Función para eliminar un proyecto
  const handleDeleteProject = async (id) => {
    try {
      await ProjectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      setSnackbarMessage('Proyecto eliminado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      setSnackbarMessage('Error al eliminar el proyecto');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Función para determinar el color del chip de estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'En progreso':
        return 'primary';
      case 'Iniciado':
        return 'warning';
      default:
        return 'default';
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
    <Box sx={{ p: 3, display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Panel izquierdo: Lista de proyectos */}
      <Box sx={{ 
        width: showTasks ? '60%' : '100%', 
        transition: 'width 0.3s ease',
        pr: showTasks ? 2 : 0
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Proyectos
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Proyecto
          </Button>
        </Box>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={showTasks ? 6 : 4} md={showTasks ? 6 : 4} key={project.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: selectedProject && selectedProject.id === project.id ? `2px solid ${theme.palette.primary.main}` : 'none'
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Chip 
                    label={project.status} 
                    color={getStatusColor(project.status)} 
                    size="small" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">
                        Progreso: {project.progress}%
                      </Typography>
                      <Typography variant="body2">
                        {project.completedTasks}/{project.tasks} tareas
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.progress || 0} 
                      sx={{ height: 8, borderRadius: 5 }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha límite: {project.dueDate}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<TaskIcon />}
                    onClick={() => {
                      setSelectedProject(project);
                      fetchProjectTasks(project.id);
                    }}
                  >
                    Ver tareas
                  </Button>
                  <Button size="small" onClick={() => handleOpenDialog(project)}>
                    Editar
                  </Button>
                  <IconButton size="small" color="error" onClick={() => handleDeleteProject(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Panel derecho: Tareas del proyecto seleccionado */}
      {showTasks && (
        <Box sx={{ 
          width: '40%', 
          borderLeft: `1px solid ${theme.palette.divider}`,
          pl: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Tareas: {selectedProject?.title}
            </Typography>
            <Box>
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setOpenTaskDialog(true)}
                sx={{ mr: 1 }}
              >
                Nueva Tarea
              </Button>
              <IconButton onClick={() => setShowTasks(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {loadingTasks ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : taskError ? (
            <Alert severity="error" sx={{ mb: 2 }}>{taskError}</Alert>
          ) : (
            <Paper sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              {selectedProjectTasks.length > 0 ? (
                <List>
                  {selectedProjectTasks.map((task) => (
                    <React.Fragment key={task.id}>
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
                            <Typography sx={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'text.secondary' : 'text.primary'
                            }}>
                              {task.title}
                            </Typography>
                          }
                          secondary={task.description}
                        />
                        <Chip
                          label={task.priority}
                          color={getTaskPriorityColor(task.priority)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay tareas para este proyecto.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenTaskDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Crear primera tarea
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Box>
      )}

      {/* Diálogo para crear/editar proyecto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={projectForm.title}
            onChange={handleFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            name="description"
            value={projectForm.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              name="status"
              value={projectForm.status}
              onChange={handleFormChange}
            >
              <MenuItem value="Iniciado">Iniciado</MenuItem>
              <MenuItem value="En progreso">En progreso</MenuItem>
              <MenuItem value="Completado">Completado</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Fecha límite"
            type="date"
            fullWidth
            variant="outlined"
            name="dueDate"
            value={projectForm.dueDate}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveProject}>
            {selectedProject ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear tarea */}
      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Tarea</DialogTitle>
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
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={taskForm.description}
            onChange={handleTaskFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="priority-label">Prioridad</InputLabel>
            <Select
              labelId="priority-label"
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
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateTask} variant="contained" color="primary">Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Projects;