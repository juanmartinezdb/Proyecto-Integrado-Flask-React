import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Tooltip, 
  Divider,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import { 
  Shield as GearIcon, 
  AutoFixHigh as SkillIcon,
  Info as InfoIcon 
} from '@mui/icons-material';
import axios from 'axios';

const ActiveGearSkills = () => {
  const [activeGear, setActiveGear] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener equipamiento y habilidades activas desde el backend
  useEffect(() => {
    const fetchActiveItems = async () => {
      try {
        setLoading(true);
        // Obtener equipamiento activo
        const gearResponse = await axios.get('http://localhost:5000/inventory/active');
        setActiveGear(gearResponse.data.items || []);
        
        // Obtener habilidades activas
        const skillsResponse = await axios.get('http://localhost:5000/skills/active');
        setActiveSkills(skillsResponse.data.items || []);
      } catch (err) {
        console.error('Error al obtener items activos:', err);
        setError('No se pudieron cargar los items activos');
        // Datos de ejemplo para desarrollo
        setActiveGear([{ id: 1, name: 'Amuleto de Concentración', uses_left: 3, effect: { name: 'Concentración +10%' } }]);
        setActiveSkills([{ id: 1, name: 'Enfoque Mental', mana_cost: 5, effect: { name: 'Reduce distracciones' } }]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveItems();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ px: 1, mb: 1, fontWeight: 'medium' }}>
        Equipamiento Activo
      </Typography>
      
      {activeGear.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1, fontSize: '0.875rem' }}>
          No tienes equipamiento activo
        </Typography>
      ) : (
        <List dense sx={{ p: 0 }}>
          {activeGear.map((item) => (
            <ListItem key={item.id} sx={{ px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <GearIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                secondary={
                  <Tooltip title={item.effect?.name || 'Sin efecto'} arrow>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <InfoIcon fontSize="inherit" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {item.uses_left ? `${item.uses_left} usos restantes` : 'Permanente'}
                      </Typography>
                    </Box>
                  </Tooltip>
                }
                primaryTypographyProps={{ noWrap: true, fontSize: '0.875rem' }}
              />
            </ListItem>
          ))}
        </List>
      )}
      
      <Divider sx={{ my: 1.5 }} />
      
      <Typography variant="subtitle1" sx={{ px: 1, mb: 1, fontWeight: 'medium' }}>
        Habilidades Activas
      </Typography>
      
      {activeSkills.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1, fontSize: '0.875rem' }}>
          No tienes habilidades activas
        </Typography>
      ) : (
        <List dense sx={{ p: 0 }}>
          {activeSkills.map((skill) => (
            <ListItem key={skill.id} sx={{ px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SkillIcon color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                      {skill.name}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${skill.mana_cost} MP`}
                      color="info" 
                      variant="outlined"
                      sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.625rem' } }}
                    />
                  </Box>
                }
                secondary={
                  <Tooltip title={skill.effect?.description || 'Sin descripción'} arrow>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {skill.effect?.name || 'Efecto desconocido'}
                    </Typography>
                  </Tooltip>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ActiveGearSkills;