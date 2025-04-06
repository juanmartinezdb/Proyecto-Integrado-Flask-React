import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import BalancedStarSVG from '../assets/balanced_star.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 500,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box 
          component="img" 
          src={BalancedStarSVG} 
          alt="Iter Polaris" 
          sx={{ width: 80, height: 80, mb: 2, opacity: 0.7 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Parece que te has desviado de tu camino. La página que buscas no existe o ha sido movida.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Deja que la Estrella Polar te guíe de vuelta.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;