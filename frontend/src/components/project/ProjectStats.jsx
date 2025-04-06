import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Tooltip
} from '@mui/material';

const ProjectStats = ({ project, tasks }) => {
  // Calcular estadísticas
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0;
  const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
  
  // Calcular progreso
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Progreso del Proyecto
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2">
            Progreso general
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {progress}%
          </Typography>
        </Box>
        <Tooltip title={`${progress}% completado`} arrow>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Tooltip>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="success.main">
              {completedTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completadas
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="info.main">
              {inProgressTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              En progreso
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="warning.main">
              {pendingTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pendientes
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProjectStats;