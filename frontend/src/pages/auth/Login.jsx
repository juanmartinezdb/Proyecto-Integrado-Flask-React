import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  Container
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import BalancedStarSVG from '../../assets/balanced_star.png';
import { LogoSpinner } from '../../components/common';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta a la que redirigir después del login
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Corregido para enviar username en lugar de email
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm" className="h-screen flex items-center">
      <Paper 
        elevation={3} 
        className="w-full p-6 rounded-xl shadow-lg bg-white/90 backdrop-blur-md border border-gray-100"
      >
        <Box className="flex flex-col items-center mb-6">
          <Box 
            component="img" 
            src={BalancedStarSVG} 
            alt="Iter Polaris" 
            className="w-20 h-20 mb-4 object-contain animate-pulse-slow"
          />
          <Typography component="h1" variant="h4" className="font-bold text-primary text-center">
            Iter Polaris
          </Typography>
          <Typography variant="subtitle1" className="mt-2 text-gray-600 text-center">
            Tu viaje de productividad guiado por la Estrella Polar
          </Typography>
        </Box>
        
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="bg-white/80"
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="bg-white/80"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="mt-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium"
            disabled={loading}
          >
            {loading ? <LogoSpinner size="small" message="" /> : 'Iniciar Sesión'}
          </Button>
          <Box className="text-center mt-6">
            <Typography variant="body2" className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link component={RouterLink} to="/register" className="text-primary hover:text-primary/80 font-medium">
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;