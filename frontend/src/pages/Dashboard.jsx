import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  IconButton, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  MoreVert as MoreIcon, 
  Assignment as TaskIcon, 
  Loop as HabitIcon, 
  Star as StarIcon, 
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Book as JournalIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los diferentes datos del dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [dailyHabits, setDailyHabits] = useState([]);
  const [recentJournals, setRecentJournals] = useState([]);
  
  // Obtener datos para el dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas del usuario
        const statsResponse = await axios.get('http://localhost:5000/stats');
        setStats(statsResponse.data);
        
        // Obtener tareas recientes
        const recentTasksResponse = await axios.get('http://localhost:5000/tasks/recent');
        setRecentTasks(recentTasksResponse.data.items || []);
        
        // Obtener tareas próximas
        const upcomingTasksResponse = await axios.get('http://localhost:5000/tasks/upcoming');
        setUpcomingTasks(upcomingTasksResponse.data.items || []);
        
        // Obtener hábitos diarios
        const habitsResponse = await axios.get('http://localhost:5000/habits/daily');
        setDailyHabits(habitsResponse.data.items || []);
        
        // Obtener entradas de diario recientes
        const journalsResponse = await axios.get('http://localhost:5000/journals/entries/recent');
        setRecentJournals(journalsResponse.data.items || []);
        
      } catch (err) {
        console.error('Error al obtener datos del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard');
        
        // Datos de ejemplo para desarrollo
        setStats({
          completed_tasks: 12,
          streak_days: 5,
          total_xp: 1250,
          level: 4,
          next_level_xp: 1500,
          energy_balance: 10
        });
        
        setRecentTasks([
          { id: 1, title: 'Completar informe', status: 'completed', due_date: '2023-05-15', project: { name: 'Proyecto Web' } },
          { id: 2, title: 'Diseñar logo', status: 'in_progress', due_date: '2023-05-18', project: { name: 'Rediseño' } }
        ]);
        
        setUpcomingTasks([
          { id: 3, title: 'Reunión con cliente', status: 'pending', due_date: '2023-05-20', project: { name: 'Consultoría' } },
          { id: 4, title: 'Entregar propuesta', status: 'pending', due_date: '2023-05-22', project: { name: 'Nuevo Proyecto' } }
        ]);
        
        setDailyHabits([
          { id: 1, name: 'Meditar', completed_today: true, streak: 7 },
          { id: 2, name: 'Ejercicio', completed_today: false, streak: 3 },
          { id: 3, name: 'Leer', completed_today: false, streak: 12 }
        ]);
        
        setRecentJournals([
          { id: 1, title: 'Reflexiones del día', created_at: '2023-05-14', mood: 'positive' },
          { id: 2, title: 'Ideas para el proyecto', created_at: '2023-05-12', mood: 'neutral' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
      {/* Encabezado del Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Bienvenido, {currentUser?.username || 'Aventurero'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tu viaje continúa. Aquí tienes un resumen de tu progreso.
        </Typography>
      </Box>
      
      {/* Tarjetas de estadísticas */}
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
            <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
              <TaskIcon />
            </Avatar>
            <Typography variant="h5" component="div">
              {stats?.completed_tasks || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tareas Completadas
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
            <Avatar sx={{ bgcolor: 'success.main', mb: 1 }}>
              <HabitIcon />
            </Avatar>
            <Typography variant="h5" component="div">
              {stats?.streak_days || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Días de Racha
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
            <Avatar sx={{ bgcolor: 'warning.main', mb: 1 }}>
              <StarIcon />
            </Avatar>
            <Typography variant="h5" component="div">
              {stats?.total_xp || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Experiencia Total
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
            <Avatar sx={{ bgcolor: 'info.main', mb: 1 }}>
              <TrendingUpIcon />
            </Avatar>
            <Typography variant="h5" component="div">
              {stats?.level || 1}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nivel Actual
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Tareas recientes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader
              title="Tareas Recientes"
              action={
                <IconButton aria-label="configuración">
                  <MoreIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              {recentTasks.length > 0 ? (
                <List>
                  {recentTasks.map((task) => (
                    <ListItem 
                      key={task.id}
                      secondaryAction={
                        <Chip 
                          size="small" 
                          label={task.status === 'completed' ? 'Completada' : 'En progreso'}
                          color={task.status === 'completed' ? 'success' : 'warning'}
                        />
                      }
                    >
                      <ListItemIcon>
                        <TaskIcon color={task.status === 'completed' ? 'success' : 'action'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={task.title}
                        secondary={`${task.project?.name || 'Sin proyecto'} - ${formatDate(task.due_date)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No hay tareas recientes
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/projects')}
                >
                  Ver todos los proyectos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Próximas tareas */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader
              title="Próximas Tareas"
              action={
                <IconButton aria-label="configuración">
                  <MoreIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <List>
                  {upcomingTasks.map((task) => (
                    <ListItem 
                      key={task.id}
                      secondaryAction={
                        <Chip 
                          size="small" 
                          label={formatDate(task.due_date)}
                          color="primary"
                          variant="outlined"
                        />
                      }
                    >
                      <ListItemIcon>
                        <CalendarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={task.title}
                        secondary={task.project?.name || 'Sin proyecto'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No hay tareas próximas
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/calendar')}
                >
                  Ver calendario
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Hábitos diarios */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader
              title="Hábitos Diarios"
              action={
                <IconButton aria-label="configuración">
                  <MoreIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              {dailyHabits.length > 0 ? (
                <List>
                  {dailyHabits.map((habit) => (
                    <ListItem 
                      key={habit.id}
                      secondaryAction={
                        <Chip 
                          size="small" 
                          label={`Racha: ${habit.streak}`}
                          color="success"
                          variant="outlined"
                        />
                      }
                    >
                      <ListItemIcon>
                        <HabitIcon color={habit.completed_today ? 'success' : 'action'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={habit.name}
                        secondary={habit.completed_today ? 'Completado hoy' : 'Pendiente hoy'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No hay hábitos configurados
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/habits')}
                >
                  Gestionar hábitos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Entradas de diario recientes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader
              title="Diario Reciente"
              action={
                <IconButton aria-label="configuración">
                  <MoreIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              {recentJournals.length > 0 ? (
                <List>
                  {recentJournals.map((entry) => (
                    <ListItem 
                      key={entry.id}
                      secondaryAction={
                        <Chip 
                          size="small" 
                          label={formatDate(entry.created_at)}
                          color="info"
                          variant="outlined"
                        />
                      }
                    >
                      <ListItemIcon>
                        <JournalIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={entry.title}
                        secondary={`Estado de ánimo: ${entry.mood === 'positive' ? 'Positivo' : entry.mood === 'negative' ? 'Negativo' : 'Neutral'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No hay entradas de diario recientes
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/journals')}
                >
                  Ver todos los diarios
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;