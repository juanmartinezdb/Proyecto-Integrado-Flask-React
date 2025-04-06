import React from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';

/**
 * Componente que maneja los menús desplegables del usuario (perfil, notificaciones, configuración)
 */
const UserMenus = ({
  currentUser,
  userMenuAnchor,
  notificationsAnchor,
  settingsAnchor,
  handleUserMenuClose,
  handleNotificationsClose,
  handleSettingsClose,
  handleProfileClick,
  handleLogout
}) => {
  return (
    <>
      {/* Menú de usuario */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          <Typography variant="subtitle1">{currentUser?.username || 'Usuario'}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileClick}>Ver Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>
      
      {/* Menú de notificaciones */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Typography variant="subtitle1">Notificaciones</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>Hábito "Meditar" completado</MenuItem>
        <MenuItem>Nueva tarea asignada: "Revisar documentación"</MenuItem>
        <MenuItem>¡Has desbloqueado un logro!</MenuItem>
        <MenuItem>Recordatorio: Proyecto "Diseño Web" vence mañana</MenuItem>
      </Menu>
      
      {/* Menú de configuración */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>Preferencias</MenuItem>
        <MenuItem>Notificaciones</MenuItem>
        <MenuItem>Privacidad</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenus;