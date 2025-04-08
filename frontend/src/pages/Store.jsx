import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Rating,
  Divider,
  Badge
} from '@mui/material';
import { Search as SearchIcon, ShoppingCart as CartIcon, FilterList as FilterIcon } from '@mui/icons-material';

const Store = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Simulación de carga de items desde la API
    const fetchItems = async () => {
      try {
        // En una aplicación real, aquí se haría una llamada a la API
        setTimeout(() => {
          setItems([
            {
              id: 1,
              name: 'Espada de Productividad',
              description: 'Aumenta tu productividad en un 15% durante 3 días',
              price: 500,
              type: 'Arma',
              rating: 4.5,
              effect: '+15% Productividad',
              duration: '3 días',
              image: '🗡️'
            },
            {
              id: 2,
              name: 'Escudo de Concentración',
              description: 'Bloquea distracciones durante 4 horas',
              price: 300,
              type: 'Defensa',
              rating: 4.2,
              effect: '+20% Concentración',
              duration: '4 horas',
              image: '🛡️'
            },
            {
              id: 3,
              name: 'Poción de Energía',
              description: 'Restaura tu energía completamente',
              price: 150,
              type: 'Consumible',
              rating: 4.8,
              effect: 'Restaura 100% de Energía',
              duration: 'Instantáneo',
              image: '🧪'
            },
            {
              id: 4,
              name: 'Amuleto de Creatividad',
              description: 'Aumenta tu creatividad en un 25% durante 2 días',
              price: 450,
              type: 'Accesorio',
              rating: 4.0,
              effect: '+25% Creatividad',
              duration: '2 días',
              image: '📿'
            },
            {
              id: 5,
              name: 'Pergamino de Sabiduría',
              description: 'Aumenta tu conocimiento en un área específica',
              price: 600,
              type: 'Consumible',
              rating: 4.7,
              effect: '+1 Nivel en una habilidad',
              duration: 'Permanente',
              image: '📜'
            },
            {
              id: 6,
              name: 'Capa de Invisibilidad',
              description: 'Te permite evitar interrupciones durante 5 horas',
              price: 800,
              type: 'Vestimenta',
              rating: 4.9,
              effect: '-90% Interrupciones',
              duration: '5 horas',
              image: '👘'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filtrar items según el término de búsqueda
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para agregar un item al carrito
  const addToCart = (item) => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Tienda
        </Typography>
        <Badge badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} color="primary">
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<CartIcon />}
          >
            Carrito
          </Button>
        </Badge>
      </Box>

      {/* Barra de búsqueda y filtros */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} edge="end">
                  &times;
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button variant="outlined" startIcon={<FilterIcon />}>
          Filtros
        </Button>
      </Box>

      {/* Lista de items */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  fontSize: '3rem'
                }}
              >
                {item.image}
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Chip label={item.type} size="small" color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={item.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {item.rating}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>Efecto:</strong> {item.effect}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duración:</strong> {item.duration}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {item.price} monedas
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  fullWidth
                  onClick={() => addToCart(item)}
                >
                  Añadir al carrito
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron items que coincidan con la búsqueda
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Store;