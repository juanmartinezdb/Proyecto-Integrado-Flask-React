import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const SettingsPanel = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState(settings || {
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      projectUpdates: true
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      colorScheme: 'default'
    },
    privacy: {
      showProfile: true,
      showActivity: true,
      showStats: true
    },
    language: 'es'
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Manejar cambios en los campos de formulario
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Manejar cambios en campos simples (no anidados)
  const handleSimpleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar configuración
  const handleSave = async () => {
    try {
      await onSaveSettings(formData);
      setSnackbar({
        open: true,
        message: 'Configuración guardada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la configuración',
        severity: 'error'
      });
    }
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configuración
      </Typography>

      <Box sx={{ mt: 3 }}>
        {/* Sección de Notificaciones */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Notificaciones
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications?.email || false}
                      onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                    />
                  }
                  label="Notificaciones por correo"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications?.push || false}
                      onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
                    />
                  }
                  label="Notificaciones push"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications?.taskReminders || false}
                      onChange={(e) => handleChange('notifications', 'taskReminders', e.target.checked)}
                    />
                  }
                  label="Recordatorios de tareas"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications?.projectUpdates || false}
                      onChange={(e) => handleChange('notifications', 'projectUpdates', e.target.checked)}
                    />
                  }
                  label="Actualizaciones de proyectos"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        {/* Sección de Apariencia */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaletteIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Apariencia
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="theme-select-label">Tema</InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={formData.appearance?.theme || 'system'}
                  label="Tema"
                  onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                >
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Oscuro</MenuItem>
                  <MenuItem value="system">Sistema</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="font-size-select-label">Tamaño de fuente</InputLabel>
                <Select
                  labelId="font-size-select-label"
                  value={formData.appearance?.fontSize || 'medium'}
                  label="Tamaño de fuente"
                  onChange={(e) => handleChange('appearance', 'fontSize', e.target.value)}
                >
                  <MenuItem value="small">Pequeño</MenuItem>
                  <MenuItem value="medium">Mediano</MenuItem>
                  <MenuItem value="large">Grande</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Sección de Privacidad */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Privacidad
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacy?.showProfile || false}
                      onChange={(e) => handleChange('privacy', 'showProfile', e.target.checked)}
                    />
                  }
                  label="Mostrar perfil a otros usuarios"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacy?.showActivity || false}
                      onChange={(e) => handleChange('privacy', 'showActivity', e.target.checked)}
                    />
                  }
                  label="Mostrar actividad reciente"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacy?.showStats || false}
                      onChange={(e) => handleChange('privacy', 'showStats', e.target.checked)}
                    />
                  }
                  label="Mostrar estadísticas"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box>

        {/* Sección de Idioma */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LanguageIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Idioma
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <FormControl fullWidth size="small">
            <InputLabel id="language-select-label">Idioma</InputLabel>
            <Select
              labelId="language-select-label"
              value={formData.language || 'es'}
              label="Idioma"
              onChange={(e) => handleSimpleChange('language', e.target.value)}
            >
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Botón de guardar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Guardar Configuración
          </Button>
        </Box>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SettingsPanel;