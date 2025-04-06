import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  EmojiEvents as AchievementIcon,
  Lock as LockIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';

// Componente de logro estilizado
const AchievementItem = styled(Paper)(({ theme, unlocked }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  transition: 'transform 0.2s, box-shadow 0.2s',
  opacity: unlocked ? 1 : 0.7,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Barra de progreso personalizada para logros
const AchievementProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const AchievementsList = ({ achievements = [] }) => {
  // Si no hay logros, mostrar mensaje
  if (!achievements || achievements.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3, textAlign: 'center' }}>
        <AchievementIcon color="disabled" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay logros disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completa tareas y proyectos para desbloquear logros
        </Typography>
      </Paper>
    );
  }

  // Agrupar logros por categoría
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    const category = achievement.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Logros y Desafíos
      </Typography>
      
      {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AchievementIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              {category}
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {categoryAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Tooltip 
                  title={achievement.unlocked ? 'Logro desbloqueado' : 'Logro bloqueado'} 
                  arrow
                >
                  <AchievementItem 
                    elevation={achievement.unlocked ? 2 : 1} 
                    unlocked={achievement.unlocked}
                  >
                    {/* Icono de estado */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        color: achievement.unlocked ? 'success.main' : 'text.disabled'
                      }}
                    >
                      {achievement.unlocked ? <CompletedIcon /> : <LockIcon />}
                    </Box>
                    
                    {/* Título y descripción */}
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      {achievement.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {achievement.description}
                    </Typography>
                    
                    {/* Progreso */}
                    {achievement.progress !== undefined && (
                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progreso
                          </Typography>
                          <Typography variant="caption" fontWeight="medium">
                            {achievement.current_value || 0}/{achievement.target_value}
                          </Typography>
                        </Box>
                        <AchievementProgressBar 
                          variant="determinate" 
                          value={(achievement.current_value / achievement.target_value) * 100} 
                        />
                      </Box>
                    )}
                    
                    {/* Recompensa */}
                    {achievement.reward && (
                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Chip 
                          label={`Recompensa: ${achievement.reward}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    )}
                  </AchievementItem>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default AchievementsList;