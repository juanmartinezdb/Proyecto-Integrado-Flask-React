import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  IconButton, 
  Divider,
  useMediaQuery 
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { 
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Assignment as ProjectsIcon,
  Loop as HabitsIcon,
  Book as JournalsIcon,
  Collections as MaterialsIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Importamos los componentes modulares
import EnhancedEnergyBar from '../components/energy/EnhancedEnergyBar';
import { TopNavBar } from '../components/navigation';
import UserMenus from '../components/navigation/UserMenus';
import UserProfile from '../components/sidebar/UserProfile';
import ZonesList from '../components/sidebar/ZonesList';
import ActiveGearSkills from '../components/sidebar/ActiveGearSkills';

// Ancho del sidebar
const DRAWER_WIDTH = 280;

// Altura de la barra de navegación y la barra de energía
const NAVBAR_HEIGHT = 64;
const ENERGY_BAR_HEIGHT = 36;
const TOTAL_TOP_HEIGHT = NAVBAR_HEIGHT + ENERGY_BAR_HEIGHT;

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const { currentTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  // Estados para controlar menús y drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  
  // Manejadores de eventos
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleNotificationsOpen = (event) => setNotificationsAnchor(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsAnchor(null);
  const handleSettingsOpen = (event) => setSettingsAnchor(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchor(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate('/profile');
  };
  
  // Opciones de navegación
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Calendario', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Proyectos', icon: <ProjectsIcon />, path: '/projects' },
    { text: 'Hábitos', icon: <HabitsIcon />, path: '/habits' },
    { text: 'Diarios', icon: <JournalsIcon />, path: '/journals' },
    { text: 'Materiales', icon: <MaterialsIcon />, path: '/materials' },
    { text: 'Tienda', icon: <StoreIcon />, path: '/store' },
    { text: 'Inventario', icon: <InventoryIcon />, path: '/inventory' },
  ];
  
  // Contenido del drawer (sidebar)
  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      {/* Perfil de usuario */}
      <UserProfile user={currentUser} />
      
      <Divider sx={{ my: 2 }} />
      
      {/* Lista de zonas */}
      <ZonesList />
      
      <Divider sx={{ my: 2 }} />
      
      {/* Equipamiento y habilidades activas */}
      <ActiveGearSkills />
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Barra de navegación superior */}
      <TopNavBar 
        currentUser={currentUser}
        currentTheme={currentTheme}
        navItems={navItems}
        handleDrawerToggle={handleDrawerToggle}
        handleUserMenuOpen={handleUserMenuOpen}
        handleNotificationsOpen={handleNotificationsOpen}
        handleSettingsOpen={handleSettingsOpen}
      />
      
      {/* Barra de energía (debajo de la barra de navegación) */}
      <Box 
        sx={{ 
          position: 'fixed', 
          top: NAVBAR_HEIGHT, // Altura del AppBar
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <EnhancedEnergyBar />
      </Box>
      
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: currentTheme.palette.background.paper,
            paddingTop: `${TOTAL_TOP_HEIGHT}px`, // Espacio para la barra de navegación y la barra de energía
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Contenido principal */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          mt: `${TOTAL_TOP_HEIGHT}px`, // Altura del AppBar + EnergyBar
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Outlet />
      </Box>
      
      {/* Menús de usuario, notificaciones y configuración */}
      <UserMenus 
        currentUser={currentUser}
        userMenuAnchor={userMenuAnchor}
        notificationsAnchor={notificationsAnchor}
        settingsAnchor={settingsAnchor}
        handleUserMenuClose={handleUserMenuClose}
        handleNotificationsClose={handleNotificationsClose}
        handleSettingsClose={handleSettingsClose}
        handleProfileClick={handleProfileClick}
        handleLogout={handleLogout}
      />
    </Box>
  );
};

export default MainLayout;