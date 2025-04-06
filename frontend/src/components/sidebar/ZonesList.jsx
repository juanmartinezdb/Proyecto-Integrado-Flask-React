import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Public as GeneralIcon } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';

// Componente de icono de zona personalizado
const ZoneIcon = styled(Box)(({ color }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: color || '#6a4dbc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const ZonesList = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null); // null representa "General"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { changeZoneTheme } = useTheme();

  // Obtener las zonas del usuario desde el backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/zones');
        setZones(response.data.items || response.data); // Adaptarse al formato de respuesta
      } catch (err) {
        console.error('Error al obtener zonas:', err);
        setError('No se pudieron cargar las zonas');
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  // Manejar la selección de zona
  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    
    // Cambiar el tema según la zona seleccionada
    if (zone) {
      changeZoneTheme(zone.color);
    } else {
      // Restaurar el tema predeterminado para la zona "General"
      changeZoneTheme(null);
    }
    
    // Aquí se podría implementar la lógica para filtrar el contenido por zona
    // Por ejemplo, actualizar un estado global o hacer una nueva petición al backend
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ px: 1, mb: 1, fontWeight: 'medium' }}>
        Zonas
      </Typography>
      
      <List sx={{ p: 0 }}>
        {/* Zona General (siempre presente) */}
        <ListItem disablePadding>
          <ListItemButton 
            selected={selectedZone === null}
            onClick={() => handleZoneSelect(null)}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <GeneralIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="General" />
          </ListItemButton>
        </ListItem>
        
        {/* Zonas del usuario */}
        {zones.map((zone) => (
          <ListItem key={zone.id} disablePadding>
            <ListItemButton 
              selected={selectedZone?.id === zone.id}
              onClick={() => handleZoneSelect(zone)}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ZoneIcon color={zone.color} />
              </ListItemIcon>
              <ListItemText 
                primary={zone.name} 
                primaryTypographyProps={{ 
                  noWrap: true,
                  style: { textOverflow: 'ellipsis' }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ZonesList;