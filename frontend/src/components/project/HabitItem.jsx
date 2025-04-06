import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Loop as HabitIcon
} from '@mui/icons-material';

const HabitItem = ({ habit, onEdit, onDelete }) => {
  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="editar" onClick={() => onEdit(habit)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton edge="end" aria-label="eliminar" onClick={() => onDelete(habit.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon>
        <HabitIcon color="success" />
      </ListItemIcon>
      <ListItemText
        primary={habit.name}
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              {habit.description || 'Sin descripción'}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip 
                size="small" 
                label={`Frecuencia: ${translateFrequency(habit.frequency)}`}
                color="primary"
                variant="outlined"
                sx={{ mr: 0.5 }}
              />
              <Chip 
                size="small" 
                label={`Racha: ${habit.streak || 0} días`}
                color="success"
                variant="outlined"
              />
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

// Función para traducir la frecuencia
const translateFrequency = (frequency) => {
  switch (frequency) {
    case 'daily': return 'Diaria';
    case 'weekly': return 'Semanal';
    case 'monthly': return 'Mensual';
    default: return frequency;
  }
};

export default HabitItem;