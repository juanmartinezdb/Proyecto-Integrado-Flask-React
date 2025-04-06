import React, { useState } from 'react';
import { 
  Box, 
  InputBase, 
  IconButton, 
  Paper, 
  Popover, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Estilos para el contenedor de búsqueda
const SearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    minWidth: '300px',
  },
}));

// Estilos para el icono de búsqueda
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
}));

// Estilos para el campo de entrada
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Componente de barra de búsqueda con filtros
const SearchBar = () => {
  // Estados para controlar el popover de filtros
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    zone: 'all',
    status: 'all'
  });

  // Manejadores de eventos
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      console.log('Buscando:', searchQuery, 'con filtros:', selectedFilters);
      // Aquí iría la lógica para buscar con los filtros seleccionados
      // Por ejemplo: searchService.search(searchQuery, selectedFilters);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Verificar si el popover está abierto
  const open = Boolean(filterAnchorEl);
  const id = open ? 'filter-popover' : undefined;

  // Opciones de filtros
  const filterOptions = {
    type: [
      { value: 'all', label: 'Todos' },
      { value: 'task', label: 'Tareas' },
      { value: 'habit', label: 'Hábitos' },
      { value: 'project', label: 'Proyectos' },
      { value: 'journal', label: 'Diarios' },
      { value: 'material', label: 'Materiales' }
    ],
    zone: [
      { value: 'all', label: 'Todas las zonas' },
      { value: 'work', label: 'Trabajo' },
      { value: 'personal', label: 'Personal' },
      { value: 'study', label: 'Estudio' }
      // Estas zonas se podrían cargar dinámicamente desde el backend
    ],
    status: [
      { value: 'all', label: 'Todos los estados' },
      { value: 'pending', label: 'Pendiente' },
      { value: 'in_progress', label: 'En progreso' },
      { value: 'completed', label: 'Completado' }
    ]
  };

  // Obtener etiquetas de filtros activos para mostrar
  const getActiveFilterLabels = () => {
    const activeFilters = [];
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value !== 'all') {
        const option = filterOptions[key].find(opt => opt.value === value);
        if (option) {
          activeFilters.push(option.label);
        }
      }
    });
    
    return activeFilters;
  };

  const activeFilterLabels = getActiveFilterLabels();

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <SearchContainer elevation={0}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Buscar..."
          inputProps={{ 'aria-label': 'buscar' }}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleSearch}
          endAdornment={
            searchQuery && (
              <IconButton size="small" onClick={clearSearch}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }
        />
        <IconButton 
          onClick={handleFilterClick} 
          color={activeFilterLabels.length > 0 ? "primary" : "default"}
          aria-describedby={id}
        >
          <FilterIcon />
        </IconButton>
      </SearchContainer>

      {/* Mostrar etiquetas de filtros activos */}
      {activeFilterLabels.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {activeFilterLabels.map((label, index) => (
            <Chip 
              key={index} 
              label={label} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          ))}
        </Box>
      )}

      {/* Popover de filtros */}
      <Popover
        id={id}
        open={open}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 300, p: 2 }
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Filtros de búsqueda
        </Typography>

        <FormControl fullWidth margin="dense" size="small">
          <InputLabel id="type-filter-label">Tipo de elemento</InputLabel>
          <Select
            labelId="type-filter-label"
            id="type-filter"
            name="type"
            value={selectedFilters.type}
            label="Tipo de elemento"
            onChange={handleFilterChange}
          >
            {filterOptions.type.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" size="small">
          <InputLabel id="zone-filter-label">Zona</InputLabel>
          <Select
            labelId="zone-filter-label"
            id="zone-filter"
            name="zone"
            value={selectedFilters.zone}
            label="Zona"
            onChange={handleFilterChange}
          >
            {filterOptions.zone.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" size="small">
          <InputLabel id="status-filter-label">Estado</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            name="status"
            value={selectedFilters.status}
            label="Estado"
            onChange={handleFilterChange}
          >
            {filterOptions.status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Popover>
    </Box>
  );
};

export default SearchBar;