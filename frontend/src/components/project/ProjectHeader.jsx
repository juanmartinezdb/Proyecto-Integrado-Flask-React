import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProjectHeader = ({ project, onEdit }) => {
  const navigate = useNavigate();

  // Obtener color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Traducir estado
  const translateStatus = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Traducir prioridad
  const translatePriority = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Botón de regreso y título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/projects')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {project?.name || 'Detalles del Proyecto'}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit && onEdit(project)}
        >
          Editar Proyecto
        </Button>
      </Box>

      {/* Descripción y metadatos */}
      <Typography variant="body1" color="text.secondary" paragraph>
        {project?.description || 'Sin descripción'}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip
          label={`Prioridad: ${translatePriority(project?.priority)}`}
          color={getPriorityColor(project?.priority)}
          size="small"
        />
        <Chip
          label={`Estado: ${translateStatus(project?.status)}`}
          color={getStatusColor(project?.status)}
          size="small"
        />
        {project?.due_date && (
          <Chip
            label={`Fecha límite: ${formatDate(project.due_date)}`}
            size="small"
            variant="outlined"
          />
        )}
        <Chip
          label={`Creado: ${formatDate(project?.created_at)}`}
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default ProjectHeader;