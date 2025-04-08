import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Assignment as ProjectsIcon,
  Loop as HabitsIcon,
  Book as JournalsIcon,
  Inventory as MaterialsIcon,
  Store as StoreIcon,
  Backpack as InventoryIcon
} from '@mui/icons-material';

// Contextos
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const TopNavBar = ({ toggleSidebar, zoneColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotification();
  
  // Estados para los menús desplegables
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  
  // Manejadores para abrir/cerrar menús
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  // Manejador para cerrar sesión
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };
  
  // Navegación principal
  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { name: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
    { name: 'Habits', icon: <HabitsIcon />, path: '/habits' },
    { name: 'Journals', icon: <JournalsIcon />, path: '/journals' },
    { name: 'Materials', icon: <MaterialsIcon />, path: '/materials' },
    { name: 'Store', icon: <StoreIcon />, path: '/store' },
    { name: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  ];
  
  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: zoneColor || theme.palette.primary.main,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Toolbar>
        {/* Botón de menú para mostrar/ocultar sidebar */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo y título */}
        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'none', sm: 'flex' },
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
            alignItems: 'center'
          }}
        >
          <img 
            src="/src/assets/polar-star.svg" 
            alt="Iter Polaris" 
            style={{ height: '24px', marginRight: '8px' }} 
          />
          Iter Polaris
        </Typography>
        
        {/* Botones de navegación para pantallas grandes */}
        {!isMobile && (
          <Box sx={{ display: 'flex', mx: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={RouterLink}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                sx={{ mx: 0.5 }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        )}
        
        {/* Barra de búsqueda */}
        <Box sx={{ 
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
          },
          marginRight: theme.spacing(2),
          marginLeft: 0,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
          },
          flexGrow: 1,
          maxWidth: 500
        }}>
          <Box sx={{ 
            padding: theme.spacing(0, 2), 
            height: '100%', 
            position: 'absolute', 
            pointerEvents: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search…"
            sx={{
              color: 'inherit',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                  width: '20ch',
                },
              },
            }}
          />
        </Box>
        
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
          {/* Icono de notificaciones */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={handleOpenNotificationsMenu}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menú de notificaciones */}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-notifications"
            anchorEl={anchorElNotifications}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
          >
            <MenuItem onClick={handleCloseNotificationsMenu}>
              <Typography textAlign="center">No new notifications</Typography>
            </MenuItem>
          </Menu>
          
          {/* Icono de configuración */}
          <Tooltip title="Settings">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          {/* Avatar del usuario */}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar 
                alt={currentUser?.username || 'User'} 
                src={currentUser?.avatar_image || '/src/assets/default-avatar.png'} 
              />
            </IconButton>
          </Tooltip>
          
          {/* Menú del usuario */}
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>
              <Typography textAlign="center">{currentUser?.username || 'User'}</Typography>
            </MenuItem>
            <MenuItem component={RouterLink} to="/dashboard" onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Ver Perfil</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;