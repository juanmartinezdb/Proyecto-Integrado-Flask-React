import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Star as StarIcon,
  EmojiEvents as AchievementIcon,
  Equalizer as StatsIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    bio: ''
  });

  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas del usuario
        const statsResponse = await api.get('/stats/user');
        setStats(statsResponse.data);
        
        // Cargar logros del usuario
        const achievementsResponse = await api.get('/achievements/user');
        setAchievements(achievementsResponse.data || []);
        
        // Cargar historial de actividad
        const historyResponse = await api.get('/log-entries?limit=10');
        setHistory(historyResponse.data || []);
        
        // Inicializar formulario con datos actuales
        if (currentUser) {
          setUserForm({
            username: currentUser.username || '',
            email: currentUser.email || '',
            bio: currentUser.bio || ''
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del perfil:', err);
        setError('No se pudieron cargar los datos del perfil. Por favor, intenta de nuevo más tarde.');
        
        // Datos de ejemplo en caso de error
        setStats({
          level: 5,
          xp: 1250,
          nextLevelXp: 2000,
          energy: 25,
          gems: 120,
          coins: 350
        });
        
        setAchievements([
          { id: 1, name: 'Primer Hábito', description: 'Crear tu primer hábito', icon: '🌱', unlocked: true },
          { id: 2, name: 'Maestro de Tareas', description: 'Completar 10 tareas', icon: '✅', unlocked: true },
          { id: 3, name: 'Explorador', description: 'Visitar todas las secciones', icon: '🧭', unlocked: false }
        ]);
        
        setHistory([
          { id: 1, action: 'Completó tarea', target: 'Estudiar React', timestamp: '2023-06-15T14:30:00Z' },
          { id: 2, action: 'Creó proyecto', target: 'Proyecto Final', timestamp: '2023-06-14T10:15:00Z' },
          { id: 3, action: 'Ganó logro', target: 'Primer Hábito', timestamp: '2023-06-12T09:45:00Z' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [currentUser]);
  
  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    try {
      // En una implementación real, aquí se enviarían los datos a la API
      // await api.put('/users/me', userForm);
      
      setOpenEditDialog(false);
      // Aquí se actualizaría el estado global del usuario
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
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
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Avatar y datos básicos */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={currentUser?.avatar_image || '/src/assets/default-avatar.svg'}
              alt={currentUser?.username || 'Usuario'}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {currentUser?.username || 'Usuario'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentUser?.email || 'usuario@ejemplo.com'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setOpenEditDialog(true)}
              sx={{ mt: 2 }}
            >
              Editar Perfil
            </Button>
          </Grid>
          
          {/* Estadísticas y nivel */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Nivel {stats?.level || 1}
            </Typography>
            
            {/* Barra de progreso de XP */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <Box
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    background: `linear-gradient(90deg, #4caf50 ${(stats?.xp / stats?.nextLevelXp) * 100}%, #e0e0e0 ${(stats?.xp / stats?.nextLevelXp) * 100}%)`
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stats?.xp || 0}/{stats?.nextLevelXp || 1000} XP
              </Typography>
            </Box>
            
            {/* Recursos */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {stats?.energy || 0}
                    </Typography>
                    <Typography variant="body2">Energía</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary">
                      {stats?.gems || 0}
                    </Typography>
                    <Typography variant="body2">Gemas</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {stats?.coins || 0}
                    </Typography>
                    <Typography variant="body2">Monedas</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Biografía */}
            <Typography variant="body1" paragraph>
              {currentUser?.bio || 'No hay biografía disponible.'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Pestañas para diferentes secciones */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab icon={<StarIcon />} label="Logros" />
            <Tab icon={<StatsIcon />} label="Estadísticas" />
            <Tab icon={<HistoryIcon />} label="Historial" />
          </Tabs>
        </Box>
        
        {/* Contenido de Logros */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {achievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card sx={{ 
                    height: '100%',
                    opacity: achievement.unlocked ? 1 : 0.6,
                    bgcolor: achievement.unlocked ? 'background.paper' : 'action.disabledBackground'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          fontSize: '2rem', 
                          mr: 2,
                          width: 40,
                          height: 40,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          {achievement.icon || <AchievementIcon />}
                        </Box>
                        <Typography variant="h6">
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {achievement.description}
                      </Typography>
                      {achievement.unlocked && (
                        <Chip 
                          label="Desbloqueado" 
                          color="success" 
                          size="small" 
                          sx={{ mt: 1 }} 
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Contenido de Estadísticas */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tareas
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Completadas:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.completedTasks || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Pendientes:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.pendingTasks || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Hábitos
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Activos:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.activeHabits || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Racha más larga:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.longestStreak || 0} días
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Proyectos
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Completados:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.completedProjects || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          En progreso:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.inProgressProjects || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Iniciados:
                        </Typography>
                        <Typography variant="h6">
                          {stats?.startedProjects || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Contenido de Historial */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <List>
              {history.map((entry) => (
                <React.Fragment key={entry.id}>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${entry.action}: ${entry.target}`}
                      secondary={new Date(entry.timestamp).toLocaleString()}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Box>
      
      {/* Diálogo para editar perfil */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Nombre de usuario"
            type="text"
            fullWidth
            variant="outlined"
            value={userForm.username}
            onChange={handleFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Correo electrónico"
            type="email"
            fullWidth
            variant="outlined"
            value={userForm.email}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="bio"
            label="Biografía"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={userForm.bio}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveProfile}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;