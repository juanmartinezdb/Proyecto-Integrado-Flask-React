import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  LocalMall as InventoryIcon,
  FlashOn as UseIcon
} from '@mui/icons-material';
import axios from 'axios';

// Componente principal para el inventario
const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Cargar los items del inventario
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/inventory');
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el inventario:', err);
        setError('No se pudo cargar tu inventario. Por favor, inténtalo de nuevo más tarde.');
        
        // Datos de ejemplo para desarrollo
        setItems([
          {
            id: 1,
            item_id: 1,
            name: 'Poción de Energía',
            description: 'Restaura 20 puntos de energía inmediatamente',
            category: 'consumable',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'common',
            quantity: 3,
            effects: [{ type: 'energy', value: 20 }],
            acquired_at: '2023-06-01T10:30:00'
          },
          {
            id: 2,
            item_id: 2,
            name: 'Amuleto de Concentración',
            description: 'Aumenta la concentración en un 10% durante 24 horas',
            category: 'equipment',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'rare',
            quantity: 1,
            equipped: false,
            effects: [{ type: 'focus', value: 10, duration: 24 }],
            acquired_at: '2023-06-05T14:15:00'
          },
          {
            id: 3,
            item_id: 3,
            name: 'Pergamino de Productividad',
            description: 'Otorga un 15% más de XP por tareas completadas durante 12 horas',
            category: 'consumable',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'epic',
            quantity: 2,
            effects: [{ type: 'xp_boost', value: 15, duration: 12 }],
            acquired_at: '2023-06-10T09:45:00'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  // Cambiar categoría
  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  // Filtrar items por categoría
  const filteredItems = category === 'all' 
    ? items 
    : items.filter(item => item.category === category);

  // Abrir diálogo de detalles del item
  const handleOpenItemDetails = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Usar item consumible
  const handleUseItem = async (itemId) => {
    try {
      // Aquí iría la llamada a la API para usar el item
      console.log('Usando item:', itemId);
      
      // Actualizar el inventario después de usar el item
      setItems(items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1
          };
        }
        return item;
      }).filter(item => item.quantity > 0));
      
      // Cerrar el diálogo si está abierto
      if (openDialog && selectedItem?.id === itemId) {
        setOpenDialog(false);
      }
    } catch (err) {
      console.error('Error al usar el item:', err);
      // Mostrar mensaje de error
    }
  };

  // Equipar/Desequipar item
  const handleToggleEquip = async (itemId) => {
    try {
      // Aquí iría la llamada a la API para equipar/desequipar
      console.log('Equipando/Desequipando item:', itemId);
      
      // Actualizar el estado local
      setItems(items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            equipped: !item.equipped
          };
        }
        return item;
      }));
    } catch (err) {
      console.error('Error al equipar/desequipar el item:', err);
      // Mostrar mensaje de error
    }
  };

  // Obtener color según rareza
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text.secondary';
      case 'uncommon': return 'success.main';
      case 'rare': return 'info.main';
      case 'epic': return 'secondary.main';
      case 'legendary': return 'warning.main';
      default: return 'text.primary';
    }
  };

  // Traducir rareza
  const translateRarity = (rarity) => {
    switch (rarity) {
      case 'common': return 'Común';
      case 'uncommon': return 'Poco común';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Legendario';
      default: return rarity;
    }
  };

  // Traducir categoría
  const translateCategory = (category) => {
    switch (category) {
      case 'consumable': return 'Consumible';
      case 'equipment': return 'Equipamiento';
      case 'cosmetic': return 'Cosmético';
      default: return category;
    }
  };

  // Renderizar estrellas según rareza
  const renderRarityStars = (rarity) => {
    const rarityLevels = {
      'common': 1,
      'uncommon': 2,
      'rare': 3,
      'epic': 4,
      'legendary': 5
    };
    
    const level = rarityLevels[rarity] || 1;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < level 
          ? <StarIcon key={i} fontSize="small" sx={{ color: getRarityColor(rarity) }} />
          : <StarBorderIcon key={i} fontSize="small" sx={{ color: 'text.disabled' }} />
      );
    }
    
    return stars;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mi Inventario
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtros por categoría */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={category} 
          onChange={handleCategoryChange}
          aria-label="categorías del inventario"
        >
          <Tab label="Todos" value="all" />
          <Tab label="Consumibles" value="consumable" />
          <Tab label="Equipamiento" value="equipment" />
          <Tab label="Cosméticos" value="cosmetic" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Tu inventario está vacío
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Visita la tienda para adquirir items que te ayudarán en tu progreso.
          </Typography>
          <Button 
            variant="contained" 
            href="/store"
          >
            Ir a la Tienda
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
                {item.equipped && (
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label="Equipado"
                    color="success"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 1 
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image_url || 'https://via.placeholder.com/150'}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {item.name}
                    </Typography>
                    <Tooltip title={translateRarity(item.rarity)}>
                      <Box sx={{ display: 'flex' }}>
                        {renderRarityStars(item.rarity)}
                      </Box>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={translateCategory(item.category)} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`x${item.quantity}`} 
                      size="small" 
                      color="primary"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button 
                    size="small"
                    onClick={() => handleOpenItemDetails(item)}
                    startIcon={<InfoIcon />}
                  >
                    Detalles
                  </Button>
                  {item.category === 'consumable' ? (
                    <Button 
                      variant="contained" 
                      size="small"
                      color="secondary"
                      startIcon={<UseIcon />}
                      onClick={() => handleUseItem(item.id)}
                    >
                      Usar
                    </Button>
                  ) : item.category === 'equipment' && (
                    <Button 
                      variant="contained" 
                      size="small"
                      color={item.equipped ? 'error' : 'primary'}
                      onClick={() => handleToggleEquip(item.id)}
                    >
                      {item.equipped ? 'Desequipar' : 'Equipar'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de detalles del item */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle>
              {selectedItem.name}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
                <Box 
                  component="img" 
                  src={selectedItem.image_url || 'https://via.placeholder.com/150'} 
                  alt={selectedItem.name}
                  sx={{ 
                    width: { xs: '100%', sm: 150 }, 
                    height: { xs: 200, sm: 150 },
                    objectFit: 'cover',
                    borderRadius: 1,
                    mr: { sm: 2 },
                    mb: { xs: 2, sm: 0 }
                  }}
                />
                <Box>
                  <Typography variant="body1" paragraph>
                    {selectedItem.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Rareza:
                    </Typography>
                    <Chip 
                      label={translateRarity(selectedItem.rarity)} 
                      size="small"
                      sx={{ 
                        color: getRarityColor(selectedItem.rarity),
                        borderColor: getRarityColor(selectedItem.rarity),
                        borderWidth: 1,
                        borderStyle: 'solid'
                      }}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2">
                    Categoría: {translateCategory(selectedItem.category)}
                  </Typography>
                  
                  <Typography variant="body2">
                    Cantidad: {selectedItem.quantity}
                  </Typography>
                  
                  <Typography variant="body2">
                    Adquirido: {formatDate(selectedItem.acquired_at)}
                  </Typography>
                </Box>
              </Box>
              
              {selectedItem.effects && selectedItem.effects.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    Efectos:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedItem.effects.map((effect, index) => (
                      <Typography component="li" variant="body2" key={index}>
                        {effect.type === 'energy' && `+${effect.value} energía`}
                        {effect.type === 'focus' && `+${effect.value}% concentración (${effect.duration}h)`}
                        {effect.type === 'xp_boost' && `+${effect.value}% XP (${effect.duration}h)`}
                        {effect.type === 'unlock' && 'Desbloquea contenido especial'}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
              {selectedItem.category === 'consumable' ? (
                <Button 
                  variant="contained" 
                  color="secondary"
                  startIcon={<UseIcon />}
                  onClick={() => {
                    handleUseItem(selectedItem.id);
                    handleCloseDialog();
                  }}
                >
                  Usar
                </Button>
              ) : selectedItem.category === 'equipment' && (
                <Button 
                  variant="contained" 
                  color={selectedItem.equipped ? 'error' : 'primary'}
                  onClick={() => {
                    handleToggleEquip(selectedItem.id);
                    handleCloseDialog();
                  }}
                >
                  {selectedItem.equipped ? 'Desequipar' : 'Equipar'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Inventory;