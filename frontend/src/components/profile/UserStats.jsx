import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Tooltip,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  EmojiEvents as AchievementIcon,
  Assignment as TaskIcon,
  Loop as HabitIcon
} from '@mui/icons-material';

// Barra de progreso personalizada para XP
const XPProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.accent?.main || theme.palette.warning.main, // Color dorado para XP
  },
}));

const UserStats = ({ stats }) => {
  // Calcular el porcentaje de XP para el siguiente nivel
  const xpForCurrentLevel = stats?.level * 100 || 0;
  const xpForNextLevel = (stats?.level + 1) * 100 || 100;
  const currentXP = stats?.xp || 0;
  const xpProgress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  // Estadísticas a mostrar
  const statItems = [
    { icon: <TaskIcon color="primary" />, label: 'Tareas Completadas', value: stats?.completed_tasks || 0 },
    { icon: <HabitIcon color="success" />, label: 'Racha Actual', value: stats?.streak_days || 0 },
    { icon: <AchievementIcon color="secondary" />, label: 'Logros Desbloqueados', value: stats?.achievements_count || 0 },
    { icon: <StarIcon sx={{ color: 'gold' }} />, label: 'Energía', value: stats?.energy_balance || 0 }
  ];

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Estadísticas de Progreso
      </Typography>
      
      {/* Nivel y XP */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Nivel {stats?.level || 1}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {currentXP} / {xpForNextLevel} XP
          </Typography>
        </Box>
        
        <Tooltip title={`${Math.round(xpProgress)}% para nivel ${(stats?.level || 1) + 1}`} arrow>
          <XPProgressBar variant="determinate" value={xpProgress} />
        </Tooltip>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Estadísticas principales */}
      <Grid container spacing={2}>
        {statItems.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {stat.icon}
              </Box>
              <Typography variant="h5">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {/* Monedas y recursos */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Recursos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<StarIcon />} 
            label={`${stats?.coins || 0} Monedas`} 
            sx={{ 
              backgroundColor: 'accent.light',
              color: 'accent.dark',
              borderColor: 'accent.main'
            }}
            variant="outlined"
          />
          <Chip 
            label={`${stats?.mana || 0} Mana`} 
            color="info"
            variant="outlined"
          />
          <Chip 
            label={`${stats?.gems || 0} Gemas`} 
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default UserStats;