import React, { useState, useEffect } from 'react';
import { Box, Tooltip, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Importamos las imágenes de las estrellas para los diferentes estados
import BalancedStarSVG from '../../assets/balanced_star.png';
import TiredStarSVG from '../../assets/tired_star.png';
import BurnedStarSVG from '../../assets/burned_star.png';

// Componente personalizado para la barra de progreso con gradiente de color
const EnergyProgressBar = styled(LinearProgress)(({ theme, value }) => {
  // Determinar el color basado en el valor
  // Azul para energía negativa, verde para equilibrada, rojo para positiva
  const getColorGradient = () => {
    if (value <= 30) {
      // Gradiente de azul más intenso a menos intenso
      return 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)';
    } else if (value >= 70) {
      // Gradiente de rojo menos intenso a más intenso
      return 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)';
    } else {
      // Gradiente de verde equilibrado
      return 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)';
    }
  };

  return {
    height: 20,
    borderRadius: 10,
    '& .MuiLinearProgress-bar': {
      borderRadius: 10,
      background: getColorGradient(),
    },
    '&.MuiLinearProgress-root': {
      backgroundColor: theme.palette.grey[200],
    },
  };
});

// Componente de la Estrella Polar que cambia según el estado de energía
const PolarStar = ({ energyValue }) => {
  // Determinar qué estrella mostrar basado en el valor de energía
  const getStarImage = () => {
    if (energyValue <= 30) {
      return TiredStarSVG; // Estrella cansada (azul)
    } else if (energyValue >= 70) {
      return BurnedStarSVG; // Estrella quemada (roja)
    } else {
      return BalancedStarSVG; // Estrella equilibrada (amarilla/dorada)
    }
  };

  return (
    <Box
      component="img"
      src={getStarImage()}
      alt="Polar Star"
      sx={{
        width: 40,
        height: 40,
        position: 'absolute',
        left: `calc(${energyValue}% - 20px)`, // Centrar la estrella en la posición actual
        top: -10,
        transition: 'left 0.5s ease-in-out',
        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
      }}
    />
  );
};

const EnergyBar = () => {
  const [energy, setEnergy] = useState(50); // Valor por defecto en el centro (equilibrado)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos de energía del usuario desde el backend
  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        // Llamada a la API para obtener los datos de energía del usuario
        const response = await axios.get('http://localhost:5000/stats/energy');
        
        // Calcular el valor normalizado para la barra (0-100)
        // Asumiendo que el backend devuelve un objeto con la energía actual y el rango
        const { currentEnergy, minEnergy, maxEnergy } = response.data;
        
        // Normalizar el valor de energía al rango 0-100 para la barra
        // Donde 0 es el mínimo (muy negativo), 50 es equilibrado, y 100 es el máximo (muy positivo)
        const range = maxEnergy - minEnergy;
        const normalizedValue = ((currentEnergy - minEnergy) / range) * 100;
        
        setEnergy(normalizedValue);
      } catch (err) {
        console.error('Error al obtener datos de energía:', err);
        setError('No se pudieron cargar los datos de energía');
        // Usar un valor de demostración para desarrollo
        setEnergy(50);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchEnergyData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Determinar si el usuario está en la zona de bonificación (±30% alrededor del equilibrio)
  const isInBonusZone = energy >= 35 && energy <= 65;

  // Texto de estado según el nivel de energía
  const getEnergyStatusText = () => {
    if (energy <= 30) {
      return 'Energía baja - Descansa un poco';
    } else if (energy >= 70) {
      return 'Energía alta - Tómate un descanso';
    } else {
      return isInBonusZone 
        ? '¡Energía equilibrada! +10% XP' 
        : 'Casi equilibrado';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        p: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        position: 'relative',
      }}
    >
      <Tooltip 
        title={
          <>
            <Typography variant="body2">Estado: {getEnergyStatusText()}</Typography>
            <Typography variant="body2">
              {isInBonusZone 
                ? 'Mantente en la zona equilibrada para ganar bonificación de XP' 
                : 'Intenta mantener tu energía equilibrada'}
            </Typography>
          </>
        } 
        arrow
        placement="bottom"
      >
        <Box sx={{ mt: 3, mb: 1, position: 'relative' }}>
          {/* Marcadores de la barra */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 0.5,
            px: 1,
            fontSize: '0.75rem',
            color: 'text.secondary'
          }}>
            <span>Cansado</span>
            <span>Equilibrado</span>
            <span>Quemado</span>
          </Box>
          
          {/* Barra de energía */}
          <EnergyProgressBar 
            variant="determinate" 
            value={energy}
          />
          
          {/* Estrella Polar que se mueve según el nivel de energía */}
          <PolarStar energyValue={energy} />
          
          {/* Zona de bonificación */}
          <Box sx={{
            position: 'absolute',
            left: '35%',
            width: '30%',
            height: '100%',
            top: 0,
            border: '2px dashed rgba(16, 185, 129, 0.5)',
            borderRadius: 10,
            pointerEvents: 'none',
          }} />
        </Box>
      </Tooltip>
      
      {/* Texto de estado */}
      <Typography 
        variant="body2" 
        align="center"
        sx={{ 
          mt: 1,
          fontWeight: isInBonusZone ? 'bold' : 'normal',
          color: isInBonusZone ? 'success.main' : 'text.secondary'
        }}
      >
        {getEnergyStatusText()}
      </Typography>
    </Box>
  );
};

export default EnergyBar;