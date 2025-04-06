import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Assignment as TaskIcon,
  Loop as HabitIcon,
  Collections as MaterialIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Projects = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los proyectos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending'
  });
  
  // Obtener proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/projects');
        setProjects(response.data.items || []);
      } catch (err) {
        console.error('Error al obtener proyectos:', err);
        setError('No se pudieron cargar los proyectos');
        
        // Datos de ejemplo para desarrollo
        setProjects([
          { 
            id: 1, 
            name: 'Diseño Web', 
            description: 'Rediseño del sitio web corporativo', 
            due_date: '2023-06-15', 
            priority: 'high',
            status: 'in_progress',
            progress: 65,
            tasks_count: 12,
            completed_tasks_count: 8,
            habits_count: 2,
            materials_count: 5
          },
          { 
            id: 2, 
            name: 'Aplicación Móvil', 
            description: 'Desarrollo de app para iOS y Android', 
            due_date: '2023-07-30', 
            priority: 'medium',
            status: 'pending',
            progress: 20,
            tasks_count: 18,
            completed_tasks_count: 4,
            habits_count: 1,
            materials_count: 3
          },
          { 
            id: 3, 
            name: 'Informe Trimestral', 
            description: 'Análisis de resultados del Q2', 
            due_date: '2023-05-10', 
            priority: 'high',
            status: 'completed',
            progress: 100,
            tasks_count: 5,
            completed_tasks_count: 5,
            habits_count: 0,
            materials_count: 2
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Manejar diálogo de nuevo proyecto
  const handleOpenNewProjectDialog = () => {
    setOpenNewProjectDialog(true);
  };

  const handleCloseNewProjectDialog = () => {
    setOpenNewProjectDialog(false);
    // Resetear formulario
    setNewProject({
      name: '',
      description: '',
      due_date: '',
      priority: 'medium',
      status: 'pending'
    });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProject = async () => {
    try {
      // Validar campos requeridos
      if (!newProject.name) {
        alert('Por favor ingresa un nombre para el proyecto');
        return;
      }
      
      // Enviar datos al backend
      await axios.post('http://localhost:5000/projects', newProject);
      
      // Cerrar diálogo y recargar datos
      handleCloseNewProjectDialog();
      
      // Recargar proyectos
      const response = await axios.get('http://localhost:5000/projects');
      setProjects(response.data.items || []);
      
    } catch (err) {
      console.error('Error al crear proyecto:', err);
      alert('Error al crear el proyecto. Inténtalo de nuevo.');
    }
  };

  // Navegar al detalle del proyecto
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Traducir estado
  const translateStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Traducir prioridad
  const translatePriority = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
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
    <Box sx={{ flexGrow: 1 }}>
      {/* Encabezado de Proyectos */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Proyectos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenNewProjectDialog}
        >
          Nuevo Proyecto
        </Button>
      </Box>
      
      {/* Lista de proyectos */}
      {projects.length > 0 ? (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" noWrap title={project.name}>
                      {project.name}
                    </Typography>
                  }
                  subheader={
                    <Box sx={{ mt: 0.5 }}>
                      <Chip 
                        size="small" 
                        label={translateStatus(project.status)}
                        color={getStatusColor(project.status)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        size="small" 
                        label={`Prioridad: ${translatePriority(project.priority)}`}
                        color={getPriorityColor(project.priority)}
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  }
                  action={
                    <IconButton aria-label="configuración">
                      <MoreIcon />
                    </IconButton>
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description || 'Sin descripción'}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Progreso</Typography>
                      <Typography variant="body2">{project.progress}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color={project.progress === 100 ? "success" : "primary"}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Tooltip title="Tareas">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TaskIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{project.completed_tasks_count}/{project.tasks_count}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">Tareas</Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={4}>
                      <Tooltip title="Hábitos">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HabitIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{project.habits_count}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">Hábitos</Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={4}>
                      <Tooltip title="Materiales">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MaterialIcon fontSize="small" color="info" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{project.materials_count}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">Materiales</Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Vence: {formatDate(project.due_date)}
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes proyectos activos
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Crea tu primer proyecto para comenzar a organizar tus tareas
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenNewProjectDialog}
          >
            Crear Proyecto
          </Button>
        </Box>
      )}
      
      {/* Diálogo para crear nuevo proyecto */}
      <Dialog open={openNewProjectDialog} onClose={handleCloseNewProjectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Crear Nuevo Proyecto
            <IconButton edge="end" color="inherit" onClick={handleCloseNewProjectDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre del Proyecto"
              name="name"
              value={newProject.name}
              onChange={handleProjectChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Descripción"
              name="description"
              multiline
              rows={3}
              value={newProject.description}
              onChange={handleProjectChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="due_date"
              label="Fecha de Vencimiento"
              name="due_date"
              type="date"
              value={newProject.due_date}
              onChange={handleProjectChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-label">Prioridad</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                name="priority"
                value={newProject.priority}
                label="Prioridad"
                onChange={handleProjectChange}
              >
                <MenuItem value="low">Baja</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={newProject.status}
                label="Estado"
                onChange={handleProjectChange}
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="in_progress">En Progreso</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewProjectDialog}>Cancelar</Button>
          <Button onClick={handleSubmitProject} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;