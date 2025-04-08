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
  Tabs,
  Tab,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Info as InfoIcon, Delete as DeleteIcon, AddCircle as UseIcon, Search as SearchIcon } from '@mui/icons-material';
import InventoryService from '../services/inventoryService';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogAction, setDialogAction] = useState(null); // 'use', 'deactivate', 'discard'
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cargar inventario desde la API
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await InventoryService.getAllItems();
      setInventory(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      setError('Error al cargar el inventario. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Abrir diálogo para confirmar acciones
  const handleOpenDialog = (item, action) => {
    setSelectedItem(item);
    setDialogAction(action);
    setOpenDialog(true);
  };
  
  // Manejar acciones de los items
  const handleAction = (action, item) => {
    setSelectedItem(item);
    setDialogAction(action);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setDialogAction(null);
  };
  
  // Usar un item
  const handleUseItem = async () => {
    try {
      if (!selectedItem) return;
      
      const result = await InventoryService.useItem(selectedItem.id);
      
      // Actualizar el inventario
      setInventory(inventory.map(item => 
        item.id === selectedItem.id ? { ...item, quantity: item.quantity - 1, isActive: true } : item
      ));
      
      setSnackbarMessage(`Has usado ${selectedItem.name} correctamente`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al usar item:', error);
      setSnackbarMessage('Error al usar el item');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Desactivar un item
  const handleDeactivateItem = async () => {
    try {
      if (!selectedItem) return;
      
      const result = await InventoryService.deactivateItem(selectedItem.id);
      
      // Actualizar el inventario
      setInventory(inventory.map(item => 
        item.id === selectedItem.id ? { ...item, isActive: false } : item
      ));
      
      setSnackbarMessage(`Has desactivado ${selectedItem.name} correctamente`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al desactivar item:', error);
      setSnackbarMessage('Error al desactivar el item');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Descartar un item
  const handleDiscardItem = async () => {
    try {
      if (!selectedItem) return;
      
      await InventoryService.discardItem(selectedItem.id);
      
      // Actualizar el inventario
      setInventory(inventory.filter(item => item.id !== selectedItem.id));
      
      setSnackbarMessage(`Has descartado ${selectedItem.name} correctamente`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al descartar item:', error);
      setSnackbarMessage('Error al descartar el item');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Filtrar items según la pestaña seleccionada
  const filteredItems = tabValue === 0 
    ? inventory 
    : tabValue === 1 
      ? inventory.filter(item => item.isActive) 
      : inventory.filter(item => !item.isActive);

  // Agrupar items por tipo
  const itemsByType = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Inventario
        </Typography>
      </Box>

      {/* Filtros y categorías */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoría"
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="weapon">Armas</MenuItem>
                <MenuItem value="armor">Armaduras</MenuItem>
                <MenuItem value="potion">Pociones</MenuItem>
                <MenuItem value="accessory">Accesorios</MenuItem>
                <MenuItem value="other">Otros</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Lista de items */}
      {filteredItems.length > 0 ? (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    fontSize: '2rem'
                  }}
                >
                  {item.icon || '🎁'}
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Tipo: {item.type}
                    </Typography>
                    {item.active && (
                      <Chip size="small" color="success" label="Activo" />
                    )}
                  </Box>
                  {item.effect && (
                    <Typography variant="body2" color="primary">
                      Efecto: {item.effect}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleAction('use', item)} disabled={item.active}>
                    Usar
                  </Button>
                  {item.active && (
                    <Button size="small" color="warning" onClick={() => handleAction('deactivate', item)}>
                      Desactivar
                    </Button>
                  )}
                  <Button size="small" color="error" onClick={() => handleAction('discard', item)}>
                    Descartar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No hay items en esta categoría
          </Typography>
        </Box>
      )}
      
      {/* Diálogo para confirmar acciones */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'use' && 'Usar item'}
          {dialogAction === 'deactivate' && 'Desactivar item'}
          {dialogAction === 'discard' && 'Descartar item'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'use' && `¿Estás seguro de que quieres usar ${selectedItem?.name}?`}
            {dialogAction === 'deactivate' && `¿Estás seguro de que quieres desactivar ${selectedItem?.name}?`}
            {dialogAction === 'discard' && `¿Estás seguro de que quieres descartar ${selectedItem?.name}? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            color={dialogAction === 'discard' ? 'error' : 'primary'}
            onClick={() => {
              if (dialogAction === 'use') handleUseItem();
              else if (dialogAction === 'deactivate') handleDeactivateItem();
              else if (dialogAction === 'discard') handleDiscardItem();
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory;