import { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, useTheme } from '@mui/material';
import { useUser } from '../../contexts/UserContext';
// Importar el nuevo servicio de energía
import EnergyService from './EnergyService';

// Componente de la barra de energía (alta prioridad)
const EnergyBar = () => {
  const theme = useTheme();
  const { userData } = useUser();
  const [energyData, setEnergyData] = useState({
    currentEnergy: 0,
    minEnergy: -100,
    maxEnergy: 100,
    balancedRangeMin: -30,
    balancedRangeMax: 30
  });
  
  // Obtener datos de energía del usuario
  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        // Obtener datos de energía usando el servicio de energía
        const response = await EnergyService.getEnergyStats();
        
        if (response) {
          // Calcular el rango de energía basado en los datos
          const totalEnergyRange = Math.abs(response.minEnergy) + Math.abs(response.maxEnergy);
          const balancedRangeMin = Math.max(-30, Math.floor(response.minEnergy * 0.3));
          const balancedRangeMax = Math.min(30, Math.ceil(response.maxEnergy * 0.3));
          
          setEnergyData({
            currentEnergy: response.currentEnergy || userData?.energy || 0,
            minEnergy: response.minEnergy,
            maxEnergy: response.maxEnergy,
            balancedRangeMin,
            balancedRangeMax,
            totalEnergyRange
          });
        }
      } catch (error) {
        console.error('Error al obtener datos de energía:', error);
        // Usar valores predeterminados si hay un error
        setEnergyData({
          currentEnergy: userData?.energy || 0,
          minEnergy: -100,
          maxEnergy: 100,
          balancedRangeMin: -30,
          balancedRangeMax: 30,
          totalEnergyRange: 200
        });
      }
    };
    
    if (userData) {
      fetchEnergyData();
    }
  }, [userData]);
  
  // Calcular la posición del indicador de energía en la barra
  const calculateEnergyPosition = () => {
    const { currentEnergy, minEnergy, maxEnergy } = energyData;
    const totalRange = Math.abs(minEnergy) + Math.abs(maxEnergy);
    
    // Convertir el valor de energía a un porcentaje en la barra
    const position = ((currentEnergy - minEnergy) / totalRange) * 100;
    return Math.max(0, Math.min(100, position)); // Asegurar que esté entre 0 y 100
  };
  
  // Determinar el estado de energía (negativo, equilibrado, positivo)
  const getEnergyState = () => {
    const { currentEnergy, balancedRangeMin, balancedRangeMax } = energyData;
    
    if (currentEnergy < balancedRangeMin) return 'negative';
    if (currentEnergy > balancedRangeMax) return 'positive';
    return 'balanced';
  };
  
  // Obtener la imagen de la estrella según el estado de energía
  const getStarImage = () => {
    const state = getEnergyState();
    
    switch (state) {
      case 'negative':
        return '/src/assets/tired_star.svg';
      case 'positive':
        return '/src/assets/burned_star.svg';
      default:
        return '/src/assets/balanced_star.svg';
    }
  };
  
  // Obtener el color de fondo de la barra según la posición
  const getBarGradient = () => {
    return `linear-gradient(90deg, 
      ${theme.palette.energy.negative} 0%, 
      ${theme.palette.energy.balanced} 50%, 
      ${theme.palette.energy.positive} 100%)`;
  };
  
  // Calcular la posición de la zona equilibrada en la barra
  const getBalancedZonePosition = () => {
    const { minEnergy, balancedRangeMin, balancedRangeMax, maxEnergy } = energyData;
    const totalRange = Math.abs(minEnergy) + Math.abs(maxEnergy);
    
    const startPos = ((balancedRangeMin - minEnergy) / totalRange) * 100;
    const endPos = ((balancedRangeMax - minEnergy) / totalRange) * 100;
    
    return {
      left: `${startPos}%`,
      width: `${endPos - startPos}%`
    };
  };
  
  const energyPosition = calculateEnergyPosition();
  const balancedZone = getBalancedZonePosition();
  const energyState = getEnergyState();
  
  return (
    <Box sx={{
      width: '100%',
      height: '64px',
      bgcolor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 2,
      position: 'relative',
      zIndex: theme.zIndex.drawer - 1
    }}>
      <Tooltip 
        title="Stay balanced (near zero) to gain bonus XP!"
        placement="bottom"
        arrow
      >
        <Box sx={{ width: '100%', position: 'relative' }}>
          {/* Etiquetas de la barra */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 0.5 
          }}>
            <Typography variant="caption" color="text.secondary">
              Negative Energy
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Positive Energy
            </Typography>
          </Box>
          
          {/* Barra de energía con gradiente */}
          <Box sx={{
            height: '12px',
            width: '100%',
            borderRadius: '6px',
            background: getBarGradient(),
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Zona equilibrada (±30%) */}
            <Box sx={{
              position: 'absolute',
              height: '100%',
              left: balancedZone.left,
              width: balancedZone.width,
              border: '2px dashed rgba(255, 255, 255, 0.7)',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }} />
            
            {/* Indicador de energía actual (estrella) */}
            <Box sx={{
              position: 'absolute',
              left: `calc(${energyPosition}% - 12px)`,
              top: '-6px',
              width: '24px',
              height: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'left 0.5s ease-out'
            }}>
              <Box 
                component="img"
                src={getStarImage()}
                alt="Energy Star"
                sx={{
                  width: '24px',
                  height: '24px',
                  filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))',
                  animation: energyState === 'balanced' ? 'pulse 2s infinite ease-in-out' : 'none',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '2px',
                  border: '1px solid rgba(0, 0, 0, 0.2)'
                }}
              />
            </Box>
          </Box>
          
          {/* Valor numérico de energía */}
          <Typography 
            variant="body2" 
            align="center"
            sx={{ 
              mt: 0.5,
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            Energy: {energyData.currentEnergy}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default EnergyBar;