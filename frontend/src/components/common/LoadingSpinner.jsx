import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import logo from '../../assets/balanced_star.png';

const LoadingSpinner = ({ size = 'medium', message = 'Cargando...' }) => {
  // Determinar el tamaño del spinner y el logo basado en el prop size
  const getSize = () => {
    switch (size) {
      case 'small': return { spinner: 40, logo: 20 };
      case 'large': return { spinner: 100, logo: 50 };
      default: return { spinner: 60, logo: 30 };
    }
  };

  const { spinner, logo: logoSize } = getSize();

  return (
    <Box className="flex flex-col items-center justify-center p-4">
      <Box className="relative" sx={{ width: spinner, height: spinner }}>
        <CircularProgress 
          size={spinner} 
          thickness={3}
          className="text-primary animate-spin-slow"
        />
        <Box 
          component="img" 
          src={logo} 
          alt="Iter Polaris"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"
          sx={{ width: logoSize, height: logoSize }}
        />
      </Box>
      {message && (
        <Box className="mt-3 text-center text-gray-600 font-medium">
          {message}
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;