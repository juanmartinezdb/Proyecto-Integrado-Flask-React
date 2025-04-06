import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  EmojiEvents as RewardIcon,
  Star as StarIcon,
  Bolt as EnergyIcon,
  AutoAwesome as ManaIcon,
  Diamond as GemIcon,
  Lightbulb as XPIcon
} from '@mui/icons-material';

// Componente de recompensa estilizado
const RewardItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[2],
  },
}));

const ProjectRewards = ({ project, progress }) => {
  // Si no hay recompensas definidas, usar valores por defecto basados en la prioridad
  const getDefaultRewards = () => {
    const priority = project?.priority?.toLowerCase() || 'medium';
    
    switch (priority) {
      case 'high':
      case 'alta':
        return {
          xp: 150,
          coins: 100,
          energy: 15,
          mana: 10,
          gems: 2
        };
      case 'medium':
      case 'media':
        return {
          xp: 100,
          coins: 50,
          energy: 10,
          mana: 5,
          gems: 1
        };
      case 'low':
      case 'baja':
        return {
          xp: 50,
          coins: 25,
          energy: 5,
          mana: 3,
          gems: 0
        };
      default:
        return {
          xp: 75,
          coins: 40,
          energy: 8,
          mana: 4,
          gems: 1
        };
    }
  };

  // Obtener recompensas del proyecto o usar valores por defecto
  const rewards = project?.rewards || getDefaultRewards();

  // Definir los tipos de recompensas a mostrar
  const rewardTypes = [
    { 
      key: 'xp', 
      label: 'Experiencia', 
      icon: <XPIcon sx={{ color: 'warning.main' }} />, 
      value: rewards.xp || 0,
      tooltip: 'Puntos de experiencia para subir de nivel'
    },
    { 
      key: 'coins', 
      label: 'Monedas', 
      icon: <StarIcon sx={{ color: 'accent.main' }} />, 
      value: rewards.coins || 0,
      tooltip: 'Monedas para comprar en la tienda'
    },
    { 
      key: 'energy', 
      label: 'Energía', 
      icon: <EnergyIcon sx={{ color: 'success.main' }} />, 
      value: rewards.energy || 0,
      tooltip: 'Energía para realizar más tareas'
    },
    { 
      key: 'mana', 
      label: 'Mana', 
      icon: <ManaIcon sx={{ color: 'info.main' }} />, 
      value: rewards.mana || 0,
      tooltip: 'Mana para usar habilidades especiales'
    },
    { 
      key: 'gems', 
      label: 'Gemas', 
      icon: <GemIcon sx={{ color: 'secondary.main' }} />, 
      value: rewards.gems || 0,
      tooltip: 'Gemas para desbloquear contenido premium'
    }
  ];

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <RewardIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          Recompensas del Proyecto
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Completa este proyecto para obtener estas recompensas. El progreso actual es del {progress || 0}%.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
        {rewardTypes.map((reward) => (
          <Grid item xs={6} sm={4} md={2.4} key={reward.key}>
            <Tooltip title={reward.tooltip} arrow>
              <RewardItem>
                <Box sx={{ mb: 1 }}>
                  {reward.icon}
                </Box>
                <Typography variant="h5" fontWeight="medium">
                  {reward.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reward.label}
                </Typography>
              </RewardItem>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      
      {/* Recompensas especiales */}
      {project?.specialRewards && project.specialRewards.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Recompensas Especiales
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {project.specialRewards.map((reward, index) => (
              <Chip 
                key={index} 
                icon={<RewardIcon />}
                label={reward.name} 
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ProjectRewards;