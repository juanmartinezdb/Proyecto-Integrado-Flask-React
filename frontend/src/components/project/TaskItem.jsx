import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';

const TaskItem = ({ task, onStatusChange, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';
  
  // Obtener color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="editar" onClick={() => onEdit(task)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton edge="end" aria-label="eliminar" onClick={() => onDelete(task.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={isCompleted}
          icon={<UncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          onChange={() => onStatusChange(task.id, isCompleted ? 'pending' : 'completed')}
          color="primary"
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="body1"
            style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}
          >
            {task.title}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {task.description || 'Sin descripción'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {task.due_date && (
                <Chip 
                  size="small" 
                  label={`Fecha: ${formatDate(task.due_date)}`}
                  variant="outlined"
                />
              )}
              {task.priority && (
                <Chip 
                  size="small" 
                  label={`Prioridad: ${task.priority}`}
                  color={getPriorityColor(task.priority)}
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

export default TaskItem;