import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Loop as HabitIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Componente para mostrar un hábito
const HabitCard = ({ habit, onComplete, onEdit, onDelete }) => {
  const isCompletedToday = habit.completed_today;
  
  // Calcular el porcentaje de completado en la semana
  const weeklyCompletionPercentage = habit.weekly_completion || 0;
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
      <CardHeader
        title={
          <Typography variant="h6" noWrap title={habit.name}>
            {habit.name}
          </Typography>
        }
        subheader={
          <Box sx={{ mt: 0.5 }}>
            <Chip 
              size="small" 
              label={`Frecuencia: ${habit.frequency === 'daily' ? 'Diaria' : 'Semanal'}`}
              color="primary"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip 
              size="small" 
              label={`Racha: ${habit.streak || 0} días`}
              color="success"
              sx={{ mb: 1 }}
            />
          </Box>
        }
        action={
          <Box>
            <IconButton aria-label="editar" onClick={() => onEdit(habit)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="eliminar" onClick={() => onDelete(habit.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {habit.description || 'Sin descripción'}
        </Typography>
        
        {/* Progreso semanal */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Progreso semanal</Typography>
            <Typography variant="body2">{weeklyCompletionPercentage}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={weeklyCompletionPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
            color={weeklyCompletionPercentage === 100 ? "success" : "primary"}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title={isCompletedToday ? "Completado hoy" : "Marcar como completado"}>
            <Checkbox
              checked={isCompletedToday}
              onChange={() => onComplete(habit.id, !isCompletedToday)}
              icon={<UncheckedIcon sx={{ fontSize: 40 }} />}
              checkedIcon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
              color="success"
            />
          </Tooltip>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Última vez: {habit.last_completed ? new Date(habit.last_completed).toLocaleDateString() : 'Nunca'}
        </Typography>
        <Chip 
          size="small" 
          label={isCompletedToday ? "Completado hoy" : "Pendiente hoy"}
          color={isCompletedToday ? "success" : "warning"}
          variant="outlined"
        />
      </CardActions>
    </Card>
  );
};

const Habits = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los hábitos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [openHabitDialog, setOpenHabitDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitForm, setHabitForm] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    project_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'daily', 'weekly'
  
  // Obtener hábitos y proyectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener hábitos
        const habitsResponse = await axios.get('http://localhost:5000/habits');
        setHabits(habitsResponse.data.items || []);
        
        // Obtener estadísticas de hábitos
        const statsResponse = await axios.get('http://localhost:5000/habits/stats');
        setStats(statsResponse.data);
        
        // Obtener proyectos para el formulario
        const projectsResponse = await axios.get('http://localhost:5000/projects');
        setProjects(projectsResponse.data.items || []);
        
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudieron cargar los hábitos');
        
        // Datos de ejemplo para desarrollo
        setHabits([
          { 
            id: 1, 
            name: 'Meditar', 
            description: '15 minutos de meditación diaria', 
            frequency: 'daily', 
            streak: 7,
            completed_today: true,
            last_completed: '2023-05-15',
            weekly_completion: 85,
            project_id: 1
          },
          { 
            id: 2, 
            name: 'Ejercicio', 
            description: '30 minutos de actividad física', 
            frequency: 'daily', 
            streak: 3,
            completed_today: false,
            last_completed: '2023-05-14',
            weekly_completion: 57,
            project_id: null
          },
          { 
            id: 3, 
            name: 'Leer', 
            description: 'Leer al menos 20 páginas', 
            frequency: 'daily', 
            streak: 12,
            completed_today: false,
            last_completed: '2023-05-14',
            weekly_completion: 71,
            project_id: 2
          },
          { 
            id: 4, 
            name: 'Revisar finanzas', 
            description: 'Revisar gastos e ingresos', 
            frequency: 'weekly', 
            streak: 5,
            completed_today: true,
            last_completed: '2023-05-15',
            weekly_completion: 100,
            project_id: null
          }
        ]);
        
        setStats({
          total_habits: 4,
          daily_habits: 3,
          weekly_habits: 1,
          completed_today: 2,
          longest_streak: 12,
          average_completion: 78
        });
        
        setProjects([
          { id: 1, name: 'Proyecto Web' },
          { id: 2, name: 'Desarrollo Personal' },
          { id: 3, name: 'Finanzas' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar hábitos según el filtro seleccionado
  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    return habit.frequency === filter;
  });

  // Manejar cambio de estado de un hábito (completado/no completado)
  const handleHabitCompletion = async (habitId, completed) => {
    try {
      // Actualizar en el backend
      await axios.post(`http://localhost:5000/habits/${habitId}/complete`, { completed });
      
      // Actualizar en el estado local
      setHabits(habits.map(habit => {
        if (habit.id === habitId) {
          return {
            ...habit,
            completed_today: completed,
            last_completed: completed ? new Date().toISOString() : habit.last_completed,
            streak: completed ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            weekly_completion: completed ? 
              Math.min(100, habit.weekly_completion + (100 / 7)) : 
              Math.max(0, habit.weekly_completion - (100 / 7))
          };
        }
        return habit;
      }));
      
      // Actualizar estadísticas
      if (stats) {
        setStats({
          ...stats,
          completed_today: completed ? 
            stats.completed_today + 1 : 
            Math.max(0, stats.completed_today - 1)
        });
      }
      
    } catch (err) {
      console.error('Error al actualizar hábito:', err);
      alert('Error al actualizar el hábito. Inténtalo de nuevo.');
    }
  };

  // Manejar apertura de diálogo de hábito
  const handleOpenHabitDialog = (habit = null) => {
    if (habit) {
      setHabitForm({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        project_id: habit.project_id || ''
      });
      setEditingHabit(habit);
    } else {
      setHabitForm({
        name: '',
        description: '',
        frequency: 'daily',
        project_id: ''
      });
      setEditingHabit(null);
    }
    setOpenHabitDialog(true);
  };

  // Manejar cierre de diálogo
  const handleCloseHabitDialog = () => {
    setOpenHabitDialog(false);
    setEditingHabit(null);
  };

  // Manejar cambios en el formulario
  const handleHabitFormChange = (e) => {
    const { name, value } = e.target;
    setHabitForm(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmitHabit = async () => {
    try {
      // Validar campos requeridos
      if (!habitForm.name) {
        alert('Por favor ingresa un nombre para el hábito');
        return;
      }
      
      let response;
      
      if (editingHabit) {
        // Actualizar hábito existente
        response = await axios.put(`http://localhost:5000/habits/${editingHabit.id}`, habitForm);
        
        // Actualizar en el estado local
        setHabits(habits.map(habit => 
          habit.id === editingHabit.id ? { ...habit, ...habitForm } : habit
        ));
      } else {
        // Crear nuevo hábito
        response = await axios.post('http://localhost:5000/habits', habitForm);
        
        // Añadir a la lista local
        const newHabit = {
          ...response.data,
          streak: 0,
          completed_today: false,
          weekly_completion: 0
        };
        setHabits([...habits, newHabit]);
        
        // Actualizar estadísticas
        if (stats) {
          setStats({
            ...stats,
            total_habits: stats.total_habits + 1,
            daily_habits: habitForm.frequency === 'daily' ? stats.daily_habits + 1 : stats.daily_habits,
            weekly_habits: habitForm.frequency === 'weekly' ? stats.weekly_habits + 1 : stats.weekly_habits
          });
        }
      }
      
      // Cerrar diálogo
      handleCloseHabitDialog();
      
    } catch (err) {
      console.error('Error al guardar hábito:', err);
      alert('Error al guardar el hábito. Inténtalo de nuevo.');
    }
  };

  // Manejar eliminación de hábito
  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este hábito?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/habits/${habitId}`);
      
      // Eliminar del estado local
      const habitToRemove = habits.find(h => h.id === habitId);
      setHabits(habits.filter(habit => habit.id !== habitId));
      
      // Actualizar estadísticas
      if (stats && habitToRemove) {
        setStats({
          ...stats,
          total_habits: stats.total_habits - 1,
          daily_habits: habitToRemove.frequency === 'daily' ? stats.daily_habits - 1 : stats.daily_habits,
          weekly_habits: habitToRemove.frequency === 'weekly' ? stats.weekly_habits - 1 : stats.weekly_habits,
          completed_today: habitToRemove.completed_today ? stats.completed_today - 1 : stats.completed_today
        });
      }
      
    } catch (err) {
      console.error('Error al eliminar hábito:', err);
      alert('Error al eliminar el hábito. Inténtalo de nuevo.');
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
      {/* Encabezado de Hábitos */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Hábitos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenHabitDialog()}
        >
          Nuevo Hábito
        </Button>
      </Box>
      
      {/* Estadísticas de hábitos */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <HabitIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.total_habits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hábitos Totales
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.completed_today}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completados Hoy
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <WhatshotIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.longest_streak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Racha más Larga
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.average_completion}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Promedio Semanal
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Filtros */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 1.5, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
            sx={{ mx: 1 }}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'daily' ? 'contained' : 'outlined'}
            onClick={() => setFilter('daily')}
            sx={{ mx: 1 }}
          >
            Diarios
          </Button>
          <Button 
            variant={filter === 'weekly' ? 'contained' : 'outlined'}
            onClick={() => setFilter('weekly')}
            sx={{ mx: 1 }}
          >
            Semanales
          </Button>
        </Paper>
      </Box>
      
      {/* Lista de hábitos */}
      {filteredHabits.length > 0 ? (
        <Grid container spacing={3}>
          {filteredHabits.map((habit) => (
            <Grid item xs={12} sm={6} md={4} key={habit.id}>
              <HabitCard 
                habit={habit}
                onComplete={handleHabitCompletion}
                onEdit={handleOpenHabitDialog}
                onDelete={handleDeleteHabit}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay hábitos {filter !== 'all' ? (filter === 'daily' ? 'diarios' : 'semanales') : ''}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Crea tu primer hábito para comenzar a construir rutinas positivas
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenHabitDialog()}
          >
            Crear Hábito
          </Button>
        </Box>
      )}
      
      {/* Diálogo para crear/editar hábito */}
      <Dialog open={openHabitDialog} onClose={handleCloseHabitDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {editingHabit ? 'Editar Hábito' : 'Crear Nuevo Hábito'}
            <IconButton edge="end" color="inherit" onClick={handleCloseHabitDialog} aria-label="close">
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
              label="Nombre del Hábito"
              name="name"
              value={habitForm.name}
              onChange={handleHabitFormChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Descripción"
              name="description"
              multiline
              rows={3}
              value={habitForm.description}
              onChange={handleHabitFormChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="frequency-label">Frecuencia</InputLabel>
              <Select
                labelId="frequency-label"
                id="frequency"
                name="frequency"
                value={habitForm.frequency}
                label="Frecuencia"
                onChange={handleHabitFormChange}
              >
                <MenuItem value="daily">Diario</MenuItem>
                <MenuItem value="weekly">Semanal</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="project-label">Proyecto (Opcional)</InputLabel>
              <Select
                labelId="project-label"
                id="project_id"
                name="project_id"
                value={habitForm.project_id}
                label="Proyecto (Opcional)"
                onChange={handleHabitFormChange}
              >
                <MenuItem value="">Ninguno</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHabitDialog}>Cancelar</Button>
          <Button onClick={handleSubmitHabit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Habits;