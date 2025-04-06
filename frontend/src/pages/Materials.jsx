import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Button,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Link,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Collections as MaterialIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon,
  Bookmark as BookmarkIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Componente para mostrar un material
const MaterialCard = ({ material, onEdit, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
      <CardHeader
        title={
          <Typography variant="h6" noWrap title={material.name}>
            {material.name}
          </Typography>
        }
        subheader={
          <Box sx={{ mt: 0.5 }}>
            <Chip 
              size="small" 
              icon={<BookmarkIcon fontSize="small" />}
              label={material.category || 'General'}
              color="primary"
              sx={{ mr: 1, mb: 1 }}
            />
            {material.project && (
              <Chip 
                size="small" 
                label={`Proyecto: ${material.project.name}`}
                color="secondary"
                sx={{ mb: 1 }}
              />
            )}
          </Box>
        }
        action={
          <Box>
            <IconButton aria-label="editar" onClick={() => onEdit(material)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="eliminar" onClick={() => onDelete(material.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {material.description || 'Sin descripción'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
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
      </CardActions>
    </Card>
  );
};

const Materials = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los materiales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    name: '',
    description: '',
    url: '',
    category: 'general',
    project_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'project', 'category'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Obtener materiales y proyectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener materiales
        const materialsResponse = await axios.get('http://localhost:5000/materials');
        setMaterials(materialsResponse.data.items || []);
        
        // Obtener proyectos para el formulario
        const projectsResponse = await axios.get('http://localhost:5000/projects');
        setProjects(projectsResponse.data.items || []);
        
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudieron cargar los materiales');
        
        // Datos de ejemplo para desarrollo
        setMaterials([
          { 
            id: 1, 
            name: 'Guía de React', 
            description: 'Documentación oficial de React', 
            url: 'https://reactjs.org/docs/getting-started.html', 
            category: 'documentación',
            project: { id: 1, name: 'Proyecto Web' }
          },
          { 
            id: 2, 
            name: 'Tutorial de Material UI', 
            description: 'Aprende a usar Material UI con React', 
            url: 'https://mui.com/getting-started/usage/', 
            category: 'tutorial',
            project: { id: 1, name: 'Proyecto Web' }
          },
          { 
            id: 3, 
            name: 'Plantilla de informe', 
            description: 'Plantilla para informes trimestrales', 
            url: 'https://example.com/template', 
            category: 'plantilla',
            project: { id: 3, name: 'Informe Trimestral' }
          }
        ]);
        
        setProjects([
          { id: 1, name: 'Proyecto Web' },
          { id: 2, name: 'Aplicación Móvil' },
          { id: 3, name: 'Informe Trimestral' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar diálogo de material
  const handleOpenMaterialDialog = (material = null) => {
    if (material) {
      setMaterialForm({
        name: material.name,
        description: material.description || '',
        url: material.url || '',
        category: material.category || 'general',
        project_id: material.project?.id || ''
      });
      setEditingMaterial(material);
    } else {
      setMaterialForm({
        name: '',
        description: '',
        url: '',
        category: 'general',
        project_id: ''
      });
      setEditingMaterial(null);
    }
    setOpenMaterialDialog(true);
  };

  const handleCloseMaterialDialog = () => {
    setOpenMaterialDialog(false);
    setEditingMaterial(null);
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setMaterialForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMaterial = async () => {
    try {
      // Validar campos requeridos
      if (!materialForm.name) {
        alert('Por favor ingresa un nombre para el material');
        return;
      }
      
      if (editingMaterial) {
        // Actualizar material existente
        await axios.put(`http://localhost:5000/materials/${editingMaterial.id}`, materialForm);
      } else {
        // Crear nuevo material
        await axios.post('http://localhost:5000/materials', materialForm);
      }
      
      // Cerrar diálogo y recargar datos
      handleCloseMaterialDialog();
      
      // Recargar materiales
      const response = await axios.get('http://localhost:5000/materials');
      setMaterials(response.data.items || []);
      
    } catch (err) {
      console.error('Error al guardar material:', err);
      alert('Error al guardar el material. Inténtalo de nuevo.');
    }
  };

  // Manejar eliminación de material
  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este material?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/materials/${materialId}`);
      
      // Actualizar lista de materiales
      setMaterials(materials.filter(material => material.id !== materialId));
    } catch (err) {
      console.error('Error al eliminar material:', err);
      alert('Error al eliminar el material. Inténtalo de nuevo.');
    }
  };

  // Filtrar materiales
  const filteredMaterials = materials.filter(material => {
    // Filtrar por término de búsqueda
    if (searchTerm && !material.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !material.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrar por proyecto o categoría
    if (filter === 'all') return true;
    if (filter.startsWith('project:')) {
      const projectId = parseInt(filter.split(':')[1]);
      return material.project?.id === projectId;
    }
    if (filter.startsWith('category:')) {
      const category = filter.split(':')[1];
      return material.category === category;
    }
    
    return true;
  });

  // Obtener categorías únicas
  const categories = [...new Set(materials.map(material => material.category).filter(Boolean))];

  // Renderizar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Materiales
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenMaterialDialog()}
        >
          Nuevo Material
        </Button>
      </Box>
      
      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Buscar materiales"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por</InputLabel>
              <Select
                value={filter}
                label="Filtrar por"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">Todos los materiales</MenuItem>
                <Divider />
                <MenuItem disabled>
                  <Typography variant="caption">Por proyecto</Typography>
                </MenuItem>
                {projects.map(project => (
                  <MenuItem key={`project-${project.id}`} value={`project:${project.id}`}>
                    {project.name}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem disabled>
                  <Typography variant="caption">Por categoría</Typography>
                </MenuItem>
                {categories.map(category => (
                  <MenuItem key={`category-${category}`} value={`category:${category}`}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material encontrado' : 'materiales encontrados'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Lista de materiales */}
      {filteredMaterials.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <MaterialIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No hay materiales disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filter !== 'all' ? 
              'Prueba con otros filtros de búsqueda' : 
              'Crea tu primer material haciendo clic en "Nuevo Material"'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMaterials.map(material => (
            <Grid item xs={12} sm={6} md={4} key={material.id}>
              <MaterialCard 
                material={material} 
                onEdit={handleOpenMaterialDialog}
                onDelete={handleDeleteMaterial}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Diálogo para crear/editar material */}
      <Dialog open={openMaterialDialog} onClose={handleCloseMaterialDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMaterial ? 'Editar Material' : 'Nuevo Material'}
          <IconButton
            aria-label="cerrar"
            onClick={handleCloseMaterialDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={materialForm.name}
                onChange={handleMaterialChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={materialForm.description}
                onChange={handleMaterialChange}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL"
                name="url"
                value={materialForm.url}
                onChange={handleMaterialChange}
                margin="normal"
                placeholder="https://ejemplo.com"
                InputProps={{
                  startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={materialForm.category}
                  label="Categoría"
                  onChange={handleMaterialChange}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="documentación">Documentación</MenuItem>
                  <MenuItem value="tutorial">Tutorial</MenuItem>
                  <MenuItem value="plantilla">Plantilla</MenuItem>
                  <MenuItem value="referencia">Referencia</MenuItem>
                  <MenuItem value="libro">Libro</MenuItem>
                  <MenuItem value="curso">Curso</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Proyecto (opcional)</InputLabel>
                <Select
                  name="project_id"
                  value={materialForm.project_id}
                  label="Proyecto (opcional)"
                  onChange={handleMaterialChange}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMaterialDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitMaterial}
            startIcon={editingMaterial ? <EditIcon /> : <AddIcon />}
          >
            {editingMaterial ? 'Guardar Cambios' : 'Crear Material'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Materials;