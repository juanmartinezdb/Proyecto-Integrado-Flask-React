import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Badge, 
  Avatar, 
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import SearchBar from './SearchBar';

const TopNavBar = ({ 
  currentUser, 
  currentTheme, 
  navItems, 
  handleDrawerToggle, 
  handleUserMenuOpen, 
  handleNotificationsOpen, 
  handleSettingsOpen 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
    <AppBar 
      position="fixed" 
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: currentTheme.palette.primary.main,
      }}
    >
      <Toolbar>
        {/* Botón de menú (móvil) */}
        <IconButton
          color="inherit"
          aria-label="abrir menú"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Iter Polaris
        </Typography>
        
        {/* Barra de búsqueda */}
        <Box sx={{ ml: 2, flexGrow: 1, maxWidth: { xs: '100%', sm: '400px', md: '500px' } }}>
          <SearchBar />
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Botones de navegación (escritorio) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' },
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {navItems.map((item) => (
            <Tooltip key={item.path} title={item.text}>
              <IconButton
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 0.5,
                  color: location.pathname.startsWith(item.path) ? 'secondary.main' : 'inherit',
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        
        {/* Botones de navegación (móvil) - Versión compacta */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' },
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: 'background.paper',
          boxShadow: '0 -1px 5px rgba(0,0,0,0.1)',
          justifyContent: 'space-around',
          py: 1
        }}>
          {navItems.map((item) => (
            <Tooltip key={item.path} title={item.text}>
              <IconButton
                color="primary"
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname.startsWith(item.path) ? 'secondary.main' : 'inherit',
                  fontSize: '0.75rem',
                  flexDirection: 'column',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                  }
                }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {item.text}
                </Typography>
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex' }}>
          {/* Notificaciones */}
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* Configuración */}
          <IconButton
            color="inherit"
            onClick={handleSettingsOpen}
          >
            <SettingsIcon />
          </IconButton>
          
          {/* Avatar de usuario */}
          <IconButton
            edge="end"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <Avatar 
              alt={currentUser?.username || 'Usuario'} 
              src="/static/images/avatar/1.jpg" 
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;