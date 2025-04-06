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
  Badge,
  Tooltip
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';

// Componente principal para la tienda
const Store = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [userCoins, setUserCoins] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Cargar los items de la tienda
  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/store/items');
        setItems(response.data);
        
        // Obtener monedas del usuario
        const userResponse = await axios.get('http://localhost:5000/users/me/stats');
        setUserCoins(userResponse.data.coins || 0);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar los items de la tienda:', err);
        setError('No se pudieron cargar los items de la tienda. Por favor, inténtalo de nuevo más tarde.');
        
        // Datos de ejemplo para desarrollo
        setItems([
          {
            id: 1,
            name: 'Poción de Energía',
            description: 'Restaura 20 puntos de energía inmediatamente',
            price: 50,
            category: 'consumable',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'common',
            effects: [{ type: 'energy', value: 20 }]
          },
          {
            id: 2,
            name: 'Amuleto de Concentración',
            description: 'Aumenta la concentración en un 10% durante 24 horas',
            price: 150,
            category: 'equipment',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'rare',
            effects: [{ type: 'focus', value: 10, duration: 24 }]
          },
          {
            id: 3,
            name: 'Pergamino de Productividad',
            description: 'Otorga un 15% más de XP por tareas completadas durante 12 horas',
            price: 200,
            category: 'consumable',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'epic',
            effects: [{ type: 'xp_boost', value: 15, duration: 12 }]
          },
          {
            id: 4,
            name: 'Capa del Explorador',
            description: 'Desbloquea nuevas áreas de exploración y misiones especiales',
            price: 500,
            category: 'equipment',
            image_url: 'https://via.placeholder.com/150',
            rarity: 'legendary',
            effects: [{ type: 'unlock', value: 'exploration_zones' }]
          }
        ]);
        setUserCoins(1000); // Monedas de ejemplo
      } finally {
        setLoading(false);
      }
    };

    fetchStoreItems();
  }, []);

  // Cambiar categoría
  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  // Filtrar items por categoría
  const filteredItems = category === 'all' 
    ? items 
    : items.filter(item => item.category === category);

  // Añadir item al carrito
  const handleAddToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tienda
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip 
            label={`${userCoins} monedas`}
            color="primary"
            sx={{ mr: 2 }}
          />
          <Badge badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} color="secondary">
            <CartIcon />
          </Badge>
        </Box>
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
          aria-label="categorías de la tienda"
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
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay items disponibles en esta categoría
          </Typography>
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
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
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
                  
                  <Chip 
                    label={translateCategory(item.category)} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  
                  {item.effects && item.effects.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Efectos:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                        {item.effects.map((effect, index) => (
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
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Typography variant="h6" color="primary.main">
                    {item.price} <small>monedas</small>
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<CartIcon />}
                    onClick={() => handleAddToCart(item)}
                    disabled={userCoins < item.price}
                  >
                    Comprar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Store;