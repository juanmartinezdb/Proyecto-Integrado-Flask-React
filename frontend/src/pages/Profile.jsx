import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  EmojiEvents as AchievementIcon,
  Timeline as StatsIcon,
  Inventory as InventoryIcon,
  Security as SecurityIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Importamos componentes del perfil
import {
  UserInfo,
  UserStats,
  AchievementsList,
  UserInventory,
  SettingsPanel,
  ProfileDialogs
} from '../components/profile';

// Componente principal para el perfil de usuario
const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del usuario
        const userResponse = await axios.get('http://localhost:5000/users/me');
        setUserData(userResponse.data);
        
        // Obtener estadísticas
        const statsResponse = await axios.get('http://localhost:5000/users/me/stats');
        setStats(statsResponse.data);
        
        // Obtener logros
        const achievementsResponse = await axios.get('http://localhost:5000/users/me/achievements');
        setAchievements(achievementsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos del perfil:', err);
        setError('No se pudieron cargar los datos del perfil. Por favor, inténtalo de nuevo más tarde.');
        
        // Datos de ejemplo para desarrollo
        setUserData({
          id: 1,
          username: 'usuario_ejemplo',
          email: 'usuario@ejemplo.com',
          first_name: 'Usuario',
          last_name: 'Ejemplo',
          avatar_url: 'https://via.placeholder.com/150',
          bio: 'Desarrollador de software apasionado por la productividad y el crecimiento personal.',
          created_at: '2023-01-15T10:30:00',
          role: 'user'
        });
        
        setStats({
          level: 15,
          xp: 2500,
          xp_to_next_level: 3000,
          energy: 75,
          coins: 1250,
          completed_tasks: 120,
          completed_projects: 8,
          streak_days: 14
        });
        
        setAchievements([
          {
            id: 1,
            name: 'Primeros Pasos',
            description: 'Completar 10 tareas',
            icon_url: 'https://via.placeholder.com/50',
            unlocked_at: '2023-02-10T15:45:00'
          },
          {
            id: 2,
            name: 'Maestro Organizador',
            description: 'Crear 5 proyectos',
            icon_url: 'https://via.placeholder.com/50',
            unlocked_at: '2023-03-05T09:20:00'
          },
          {
            id: 3,
            name: 'Constancia',
            description: 'Mantener una racha de 7 días',
            icon_url: 'https://via.placeholder.com/50',
            unlocked_at: '2023-04-12T11:30:00'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Cambiar pestaña activa
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Abrir diálogo
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Renderizar contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Información general
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <UserInfo user={userData} onEdit={() => handleOpenDialog('profile')} />
            </Grid>
            <Grid item xs={12} md={8}>
              <UserStats stats={stats} />
            </Grid>
          </Grid>
        );
      case 1: // Logros
        return <AchievementsList achievements={achievements} />;
      case 2: // Inventario
        return <UserInventory />;
      case 3: // Configuración
        return <SettingsPanel onOpenSecurityDialog={() => handleOpenDialog('security')} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mi Perfil
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        {/* Cabecera del perfil con avatar y datos básicos */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            position: 'relative'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar 
                src={userData?.avatar_url} 
                alt={userData?.username}
                sx={{ width: 80, height: 80, border: '3px solid white' }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h5">
                {userData?.first_name} {userData?.last_name}
              </Typography>
              <Typography variant="subtitle1">
                @{userData?.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip 
                  label={`Nivel ${stats?.level || 0}`} 
                  color="secondary" 
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`${stats?.coins || 0} monedas`} 
                  variant="outlined" 
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<EditIcon />}
                onClick={() => handleOpenDialog('profile')}
              >
                Editar Perfil
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Pestañas de navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="pestañas de perfil"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonIcon />} label="Información" />
            <Tab icon={<AchievementIcon />} label="Logros" />
            <Tab icon={<InventoryIcon />} label="Inventario" />
            <Tab icon={<SettingsIcon />} label="Configuración" />
          </Tabs>
        </Box>

        {/* Contenido de la pestaña activa */}
        <Box sx={{ p: 3 }}>
          {renderTabContent()}
        </Box>
      </Paper>

      {/* Diálogos del perfil */}
      <ProfileDialogs 
        open={openDialog}
        type={dialogType}
        onClose={handleCloseDialog}
        userData={userData}
      />
    </Container>
  );
};

export default Profile;