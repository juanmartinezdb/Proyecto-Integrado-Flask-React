import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import {
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Diálogo para editar perfil de usuario
const EditProfileDialog = ({ open, onClose, userData, onSave }) => {
  const [formData, setFormData] = React.useState(userData || {
    username: '',
    email: '',
    bio: '',
    birthdate: null,
    location: '',
    title: '',
    interests: []
  });

  // Actualizar formData cuando cambia userData
  React.useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio de fecha
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      birthdate: date
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Editar Perfil</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Información Básica
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de usuario"
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografía"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Cuéntanos sobre ti..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de nacimiento"
                  value={formData.birthdate || null}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="Ciudad, País"
              />
            </Grid>
            
            {/* Información adicional */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Información Adicional
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Título"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Ej: Explorador Novato"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="interests-label">Intereses</InputLabel>
                <Select
                  labelId="interests-label"
                  name="interests"
                  multiple
                  value={formData.interests || []}
                  onChange={handleChange}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Productividad">Productividad</MenuItem>
                  <MenuItem value="Desarrollo Personal">Desarrollo Personal</MenuItem>
                  <MenuItem value="Tecnología">Tecnología</MenuItem>
                  <MenuItem value="Arte">Arte</MenuItem>
                  <MenuItem value="Ciencia">Ciencia</MenuItem>
                  <MenuItem value="Deportes">Deportes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Diálogo para cambiar contraseña
const ChangePasswordDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = React.useState('');

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al cambiar algún campo
  };

  // Validar formulario
  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Cambiar Contraseña</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña actual"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nueva contraseña"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                helperText="La contraseña debe tener al menos 8 caracteres"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Componente principal que agrupa todos los diálogos
const ProfileDialogs = ({ 
  openEditProfile, 
  openChangePassword, 
  onCloseEditProfile, 
  onCloseChangePassword, 
  userData, 
  onSaveProfile, 
  onChangePassword 
}) => {
  return (
    <>
      <EditProfileDialog 
        open={openEditProfile} 
        onClose={onCloseEditProfile} 
        userData={userData} 
        onSave={onSaveProfile} 
      />
      
      <ChangePasswordDialog 
        open={openChangePassword} 
        onClose={onCloseChangePassword} 
        onSave={onChangePassword} 
      />
    </>
  );
};

export default ProfileDialogs;