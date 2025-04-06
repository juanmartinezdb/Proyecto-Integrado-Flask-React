import React from 'react';
import {
  Box,
  Typography,
  List,
  Paper,
  Button,
  Divider
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import MaterialItem from './MaterialItem';

const MaterialList = ({ materials, onAddMaterial, onEditMaterial, onDeleteMaterial }) => {
  return (
    <Paper elevation={1} sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Materiales ({materials.length})
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddMaterial}
        >
          Nuevo Material
        </Button>
      </Box>
      
      <Divider />
      
      {materials.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No hay materiales en este proyecto.
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {materials.map((material) => (
            <React.Fragment key={material.id}>
              <MaterialItem
                material={material}
                onEdit={onEditMaterial}
                onDelete={onDeleteMaterial}
              />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default MaterialList;