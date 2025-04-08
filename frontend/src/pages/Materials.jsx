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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MaterialService from '../services/materialService';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estado para el formulario de material
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    type: 'Documento',
    tags: ''
  });

  // Cargar materiales desde la API
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await MaterialService.getAllMaterials();
      setMaterials(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
      setError('Error al cargar los materiales. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);
  
  // Abrir diálogo para crear/editar material
  const handleOpenDialog = (material = null) => {
    if (material) {
      setSelectedMaterial(material);
      setMaterialForm({
        title: material.title,
        description: material.description,
        type: material.type,
        tags: material.tags.join(', ')
      });
    } else {
      setSelectedMaterial(null);
      setMaterialForm({
        title: '',
        description: '',
        type: 'Documento',
        tags: ''
      });
    }
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMaterial(null);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMaterialForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar un material (crear o actualizar)
  const handleSaveMaterial = async () => {
    try {
      // Convertir tags de string a array
      const formData = {
        ...materialForm,
        tags: materialForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };
      
      if (selectedMaterial) {
        // Actualizar material existente
        const updatedMaterial = await MaterialService.updateMaterial(selectedMaterial.id, formData);
        setMaterials(materials.map(m => 
          m.id === selectedMaterial.id ? updatedMaterial : m
        ));
        setSnackbarMessage('Material actualizado correctamente');
      } else {
        // Crear nuevo material
        const newMaterial = await MaterialService.createMaterial(formData);
        setMaterials([...materials, newMaterial]);
        setSnackbarMessage('Material creado correctamente');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar material:', error);
      setSnackbarMessage('Error al guardar el material');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Función para eliminar un material
  const handleDeleteMaterial = async (id) => {
    try {
      await MaterialService.deleteMaterial(id);
      setMaterials(materials.filter(m => m.id !== id));
      setSnackbarMessage('Material eliminado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al eliminar material:', error);
      setSnackbarMessage('Error al eliminar el material');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Filtrar materiales según el término de búsqueda
  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

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
          Materiales
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Material
        </Button>
      </Box>

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar materiales..."
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
      </Box>

      {/* Lista de materiales */}
      <Grid container spacing={3}>
        {filteredMaterials.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                <Typography variant="subtitle1">{material.type}</Typography>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {material.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {material.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {material.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Añadido el {formatDate(material.dateAdded)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Ver</Button>
                <IconButton size="small" color="primary" onClick={() => handleOpenDialog(material)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDeleteMaterial(material.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredMaterials.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron materiales que coincidan con la búsqueda
          </Typography>
        </Box>
      )}
      
      {/* Diálogo para crear/editar material */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMaterial ? 'Editar Material' : 'Nuevo Material'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={materialForm.title}
            onChange={handleFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            name="description"
            value={materialForm.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              name="type"
              value={materialForm.type}
              onChange={handleFormChange}
            >
              <MenuItem value="Documento">Documento</MenuItem>
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Libro">Libro</MenuItem>
              <MenuItem value="Curso">Curso</MenuItem>
              <MenuItem value="Tutorial">Tutorial</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Etiquetas (separadas por comas)"
            type="text"
            fullWidth
            variant="outlined"
            name="tags"
            value={materialForm.tags}
            onChange={handleFormChange}
            helperText="Ejemplo: React, Frontend, JavaScript"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveMaterial}>
            {selectedMaterial ? 'Guardar cambios' : 'Crear'}
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

export default Materials;