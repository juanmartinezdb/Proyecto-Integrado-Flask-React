import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Flag as PriorityIcon,
  AccessTime as TimeIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

// Componente para mostrar los detalles generales del proyecto
const ProjectDetails = ({ project }) => {
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'alta':
        return 'error';
      case 'medium':
      case 'media':
        return 'warning';
      case 'low':
      case 'baja':
        return 'success';
      default:
        return 'default';
    }
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'completado':
        return 'success';
      case 'in_progress':
      case 'en_progreso':
        return 'info';
      case 'pending':
      case 'pendiente':
        return 'warning';
      case 'cancelled':
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Traducir prioridad
  const translatePriority = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority || 'No definida';
    }
  };

  // Traducir estado
  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return 'En progreso';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status || 'No definido';
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Detalles del Proyecto
      </Typography>
      
      {/* Descripción del proyecto */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" paragraph>
          {project?.description || 'Sin descripción disponible.'}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Información adicional */}
      <Grid container spacing={2}>
        {/* Fecha de vencimiento */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Fecha límite
            </Typography>
          </Box>
          <Typography variant="body1">
            {formatDate(project?.due_date)}
          </Typography>
        </Grid>
        
        {/* Prioridad */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PriorityIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Prioridad
            </Typography>
          </Box>
          <Chip 
            label={translatePriority(project?.priority)} 
            size="small" 
            color={getPriorityColor(project?.priority)}
          />
        </Grid>
        
        {/* Estado */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <UpdateIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Estado
            </Typography>
          </Box>
          <Chip 
            label={translateStatus(project?.status)} 
            size="small" 
            color={getStatusColor(project?.status)}
          />
        </Grid>
        
        {/* Fecha de creación */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimeIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Creado el
            </Typography>
          </Box>
          <Typography variant="body1">
            {formatDate(project?.created_at)}
          </Typography>
        </Grid>
      </Grid>
      
      {/* Etiquetas del proyecto */}
      {project?.tags && project.tags.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Etiquetas
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {project.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ProjectDetails;