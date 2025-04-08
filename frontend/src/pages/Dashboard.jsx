import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useUser } from '../contexts/UserContext';

const Dashboard = () => {
  const { userData, loading } = useUser();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Aquí se podría hacer una llamada a la API para obtener estadísticas
    // Por ahora usamos datos de ejemplo
    const fetchStats = async () => {
      try {
        // Simulamos una llamada a la API
        setTimeout(() => {
          setStats({
            completedTasks: 12,
            pendingTasks: 5,
            completedProjects: 3,
            activeProjects: 2,
            streakDays: 7,
            totalXP: 1250
          });
          setLoadingStats(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || loadingStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {userData && (
        <Typography variant="h6" gutterBottom>
          Bienvenido, {userData.username}
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Estadísticas */}
        {stats && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{stats.completedTasks}</Typography>
                <Typography variant="body2">Tareas Completadas</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{stats.pendingTasks}</Typography>
                <Typography variant="body2">Tareas Pendientes</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{stats.activeProjects}</Typography>
                <Typography variant="body2">Proyectos Activos</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{stats.streakDays}</Typography>
                <Typography variant="body2">Días de Racha</Typography>
              </Paper>
            </Grid>
          </>
        )}

        {/* Aquí se pueden agregar más secciones como tareas recientes, proyectos, etc. */}
      </Grid>
    </Box>
  );
};

export default Dashboard;