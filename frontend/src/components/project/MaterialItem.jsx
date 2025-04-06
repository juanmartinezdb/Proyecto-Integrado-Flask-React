import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Collections as MaterialIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

const MaterialItem = ({ material, onEdit, onDelete }) => {
  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="editar" onClick={() => onEdit(material)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton edge="end" aria-label="eliminar" onClick={() => onDelete(material.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon>
        <MaterialIcon color="info" />
      </ListItemIcon>
      <ListItemText
        primary={material.name}
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {material.description || 'Sin descripción'}
            </Typography>
            {material.url && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<OpenInNewIcon />}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir enlace
              </Button>
            )}
          </Box>
        }
      />
    </ListItem>
  );
};

export default MaterialItem;