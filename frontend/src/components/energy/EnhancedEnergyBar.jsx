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
    height: 12, // Reducido de 20px a 12px para ocupar menos espacio
    borderRadius: 6,
    '& .MuiLinearProgress-bar': {
      borderRadius: 6,
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
        width: 24, // Reducido de 40px a 24px
        height: 24, // Reducido de 40px a 24px
        position: 'absolute',
        left: `calc(${energyValue}% - 12px)`, // Centrado horizontal (mitad del ancho)
        top: -12, // Centrado vertical (mitad de la altura)
        transition: 'left 0.5s ease-in-out',
        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
        zIndex: 2, // Asegurarse que esté por encima de la barra
      }}
    />
  );
};

// Componente para la zona de equilibrio
const BalanceZone = () => (
  <Box
    sx={{
      position: 'absolute',
      left: '35%',
      width: '30%',
      height: '100%',
      top: 0,
      background: 'rgba(16, 185, 129, 0.15)', // Fondo semitransparente en lugar de borde
      borderRadius: 6,
      pointerEvents: 'none',
      zIndex: 1, // Por debajo de la estrella pero por encima de la barra
    }}
  />
);

const EnhancedEnergyBar = () => {
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
        py: 1, // Reducido de p: 2 a py: 1 para ocupar menos espacio vertical
        px: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        position: 'relative',
        height: '36px', // Altura fija para el contenedor
        display: 'flex',
        alignItems: 'center',
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
        <Box sx={{ 
          position: 'relative', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Contenedor para la barra y los marcadores */}
          <Box sx={{ position: 'relative', height: '12px', mb: 1 }}>
            {/* Zona de bonificación */}
            <BalanceZone />
            
            {/* Barra de energía */}
            <EnergyProgressBar 
              variant="determinate" 
              value={energy}
            />
            
            {/* Estrella Polar que se mueve según el nivel de energía */}
            <PolarStar energyValue={energy} />
          </Box>
          
          {/* Marcadores de la barra */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.65rem',
            color: 'text.secondary',
            mt: 0.5,
          }}>
            <span>Cansado</span>
            <span>Equilibrado</span>
            <span>Quemado</span>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default EnhancedEnergyBar;