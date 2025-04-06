import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Tooltip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Inventory as InventoryIcon,
  Info as InfoIcon,
  Star as StarIcon,
  CheckCircle as EquippedIcon
} from '@mui/icons-material';

// Componente de ítem de inventario estilizado
const InventoryItemCard = styled(Card)(({ theme, equipped }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.2s, box-shadow 0.2s',
  border: equipped ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Componente para mostrar la rareza del ítem
const RarityBadge = ({ rarity }) => {
  // Determinar color según rareza
  const getColor = () => {
    switch (rarity?.toLowerCase()) {
      case 'común':
      case 'comun':
      case 'common':
        return 'default';
      case 'raro':
      case 'rare':
        return 'info';
      case 'épico':
      case 'epico':
      case 'epic':
        return 'secondary';
      case 'legendario':
      case 'legendary':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip 
      label={rarity} 
      size="small" 
      color={getColor()}
      sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8,
        zIndex: 1
      }}
    />
  );
};

const UserInventory = ({ inventory = [] }) => {
  // Si no hay ítems en el inventario, mostrar mensaje
  if (!inventory || inventory.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3, textAlign: 'center' }}>
        <InventoryIcon color="disabled" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Inventario vacío
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completa tareas y proyectos para obtener recompensas
        </Typography>
      </Paper>
    );
  }

  // Agrupar ítems por categoría
  const itemsByCategory = inventory.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Inventario
      </Typography>
      
      {Object.entries(itemsByCategory).map(([category, items]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InventoryIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              {category}
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.id}>
                <InventoryItemCard equipped={item.equipped}>
                  {/* Indicador de rareza */}
                  <RarityBadge rarity={item.rarity} />
                  
                  {/* Imagen del ítem */}
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image || 'https://via.placeholder.com/140x140?text=Item'}
                    alt={item.name}
                  />
                  
                  {/* Contenido del ítem */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1" component="div" fontWeight="medium" gutterBottom>
                        {item.name}
                      </Typography>
                      {item.equipped && (
                        <Tooltip title="Equipado" arrow>
                          <EquippedIcon color="primary" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    
                    {/* Estadísticas del ítem */}
                    {item.stats && Object.entries(item.stats).length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Divider sx={{ my: 1 }} />
                        {Object.entries(item.stats).map(([stat, value]) => (
                          <Box 
                            key={stat} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 0.5
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {stat}
                            </Typography>
                            <Typography variant="caption" fontWeight="medium">
                              {value > 0 ? `+${value}` : value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Valor del ítem */}
                    {item.value && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <StarIcon sx={{ fontSize: 16, color: 'accent.main', mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="medium" color="accent.dark">
                          {item.value}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </InventoryItemCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default UserInventory;