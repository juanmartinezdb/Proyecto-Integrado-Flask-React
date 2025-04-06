import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  Container,
  Stepper,
  Step,
  StepLabel,
  Grid
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import BalancedStarSVG from '../../assets/balanced_star.png';
import { LoadingSpinner } from '../../components/common';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    occupation: ''
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = (e) => {
    e.preventDefault();
    // Validar el paso actual antes de avanzar
    if (activeStep === 0) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Por favor completa todos los campos obligatorios');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Preparar datos para el registro
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        personal_data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          occupation: formData.occupation
        }
      };
      
      await register(userData);
      navigate('/login', { state: { message: 'Registro exitoso. Ahora puedes iniciar sesión.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Pasos del formulario
  const steps = ['Información de cuenta', 'Datos personales'];
  
  return (
    <Container maxWidth="sm" className="py-8 min-h-screen flex items-center">
      <Paper 
        elevation={3} 
        className="w-full p-6 rounded-xl shadow-lg bg-white/90 backdrop-blur-md border border-gray-100"
      >
        <Box className="flex flex-col items-center mb-6">
          <Box 
            component="img" 
            src={BalancedStarSVG} 
            alt="Iter Polaris" 
            className="w-20 h-20 mb-4 object-contain"
          />
          <Typography component="h1" variant="h5" className="font-bold text-primary text-center">
            Únete a Iter Polaris
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} className="mb-6">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        {activeStep === 0 ? (
          // Paso 1: Información de cuenta
          <Box component="form" onSubmit={handleNext} noValidate className="space-y-4">
            <TextField
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="bg-white/80"
              helperText="Este será tu nombre de usuario para iniciar sesión"
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="bg-white/80"
            />
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="bg-white/80"
            />
            
            <Box className="flex justify-between mt-6">
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                variant="outlined"
                className="text-primary border-primary hover:bg-primary/5"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {loading ? <LoadingSpinner size="small" message="" /> : 'Siguiente'}
              </Button>
            </Box>
          </Box>
        ) : (
          // Paso 2: Datos personales
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-white/80"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-white/80"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="age"
                  label="Edad"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={loading}
                  inputProps={{ min: 0 }}
                  className="bg-white/80"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="gender"
                  label="Género"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-white/80"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="occupation"
                  label="Ocupación"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-white/80"
                />
              </Grid>
            </Grid>
            
            <Box className="flex justify-between mt-6">
              <Button
                onClick={handleBack}
                disabled={loading}
                variant="outlined"
                className="text-primary border-primary hover:bg-primary/5"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {loading ? <LoadingSpinner size="small" message="" /> : 'Registrarse'}
              </Button>
            </Box>
          </Box>
        )}
        
        <Box className="text-center mt-6">
          <Typography variant="body2" className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link component={RouterLink} to="/login" className="text-primary hover:text-primary/80 font-medium">
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;