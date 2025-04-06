import React from 'react';
import { Box, Typography } from '@mui/material';
import BalancedStarSVG from '../../assets/balanced_star.png';

/**
 * Componente de spinner personalizado con el logo de Iter Polaris
 * Muestra una animación del logo mientras se cargan los datos
 */
const LogoSpinner = ({ size = 'medium', message = 'Cargando...' }) => {
  // Tamaños disponibles para el spinner
  const sizes = {
    small: { container: 'w-16 h-16', logo: 'w-10 h-10' },
    medium: { container: 'w-24 h-24', logo: 'w-16 h-16' },
    large: { container: 'w-32 h-32', logo: 'w-20 h-20' }
  };

  const sizeClass = sizes[size] || sizes.medium;

  return (
    <Box className="flex flex-col items-center justify-center p-4">
      <Box className={`relative ${sizeClass.container} flex items-center justify-center`}>
        {/* Círculo giratorio */}
        <Box className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/60 animate-spin"></Box>
        
        {/* Logo con animación de pulso */}
        <Box 
          component="img" 
          src={BalancedStarSVG} 
          alt="Iter Polaris"
          className={`${sizeClass.logo} animate-pulse-slow`}
        />
      </Box>
      
      {message && (
        <Typography variant="body2" className="mt-3 text-center text-gray-600 font-medium">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LogoSpinner;