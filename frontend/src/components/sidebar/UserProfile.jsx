import React from 'react';
import { Box, Avatar, Typography, LinearProgress, Tooltip, Stack, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

// Barra de progreso personalizada para XP
const XPProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.accent?.main || theme.palette.warning.main, // Color dorado para XP
  },
}));

const UserProfile = ({ user }) => {
  // Si no hay usuario, mostrar un placeholder
  if (!user) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2">Cargando perfil...</Typography>
      </Box>
    );
  }

  // Calcular el porcentaje de XP para el siguiente nivel
  // Esto es un cálculo de ejemplo, ajustar según la lógica real del juego
  const xpForCurrentLevel = user.level * 100;
  const xpForNextLevel = (user.level + 1) * 100;
  const xpProgress = ((user.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <Box sx={{ p: 2 }}>
      {/* Avatar y nombre de usuario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src={user.avatar || '/static/images/avatar/default.jpg'} 
          alt={user.username}
          sx={{ width: 80, height: 80, mb: 1, border: '2px solid', borderColor: 'primary.main' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user.username}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Explorador Novato {/* Título honorífico, podría venir del backend */}
        </Typography>
      </Box>

      {/* Estadísticas del usuario */}
      <Box sx={{ mb: 2 }}>
        {/* Nivel y barra de XP */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight="medium">Nivel {user.level}</Typography>
            <Typography variant="body2">{user.xp} XP</Typography>
          </Box>
          <Tooltip title={`${Math.round(xpProgress)}% para nivel ${user.level + 1}`} arrow>
            <XPProgressBar variant="determinate" value={xpProgress} />
          </Tooltip>
        </Box>

        {/* Otras estadísticas */}
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Energía:</Typography>
            <Chip 
              label={`${user.energy || 0}`} 
              size="small" 
              color={user.energy > 0 ? "success" : user.energy < 0 ? "error" : "default"}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Mana:</Typography>
            <Chip 
              label={`${user.mana || 0}`} 
              size="small" 
              color="info"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Monedas:</Typography>
            <Chip 
              label={`${user.coins || 0}`} 
              size="small" 
              sx={{ 
                backgroundColor: 'accent.light',
                color: 'accent.dark',
                borderColor: 'accent.main'
              }}
              variant="outlined"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserProfile;