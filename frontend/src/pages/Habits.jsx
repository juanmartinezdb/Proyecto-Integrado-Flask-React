import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Checkbox,
  IconButton,
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import HabitService from '../services/habitService';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estado para el formulario de hábito
  const [habitForm, setHabitForm] = useState({
    title: '',
    description: '',
    frequency: 'Diario'
  });

  // Cargar hábitos desde la API
  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await HabitService.getAllHabits();
      setHabits(response.items || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar hábitos:', error);
      setError('Error al cargar los hábitos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);
  
  // Abrir diálogo para crear/editar hábito
  const handleOpenDialog = (habit = null) => {
    if (habit) {
      setSelectedHabit(habit);
      setHabitForm({
        title: habit.title,
        description: habit.description,
        frequency: habit.frequency
      });
    } else {
      setSelectedHabit(null);
      setHabitForm({
        title: '',
        description: '',
        frequency: 'Diario'
      });
    }
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHabit(null);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setHabitForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para marcar un hábito como completado
  const handleToggleHabit = async (id) => {
    try {
      const habit = habits.find(h => h.id === id);
      if (!habit) return;
      
      const updatedHabit = await HabitService.toggleHabitCompletion(id, !habit.completed);
      
      setHabits(habits.map(h => 
        h.id === id ? updatedHabit : h
      ));
      
      setSnackbarMessage('Hábito actualizado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al actualizar hábito:', error);
      setSnackbarMessage('Error al actualizar el hábito');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Función para guardar un hábito (crear o actualizar)
  const handleSaveHabit = async () => {
    try {
      if (selectedHabit) {
        // Actualizar hábito existente
        const updatedHabit = await HabitService.updateHabit(selectedHabit.id, habitForm);
        setHabits(habits.map(h => 
          h.id === selectedHabit.id ? updatedHabit : h
        ));
        setSnackbarMessage('Hábito actualizado correctamente');
      } else {
        // Crear nuevo hábito
        const newHabit = await HabitService.createHabit(habitForm);
        setHabits([...habits, newHabit]);
        setSnackbarMessage('Hábito creado correctamente');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar hábito:', error);
      setSnackbarMessage('Error al guardar el hábito');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Función para eliminar un hábito
  const handleDeleteHabit = async (id) => {
    try {
      await HabitService.deleteHabit(id);
      setHabits(habits.filter(h => h.id !== id));
      setSnackbarMessage('Hábito eliminado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
      setSnackbarMessage('Error al eliminar el hábito');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Hábitos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Hábito
        </Button>
      </Box>

      <Grid container spacing={3}>
        {habits.map((habit) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Checkbox
                    checked={habit.completed}
                    onChange={() => handleToggleHabit(habit.id)}
                    color="primary"
                  />
                  <Typography variant="h6" component="div" sx={{
                    textDecoration: habit.completed ? 'line-through' : 'none',
                    color: habit.completed ? 'text.secondary' : 'text.primary'
                  }}>
                    {habit.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {habit.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Frecuencia: {habit.frequency}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary" onClick={() => handleOpenDialog(habit)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDeleteHabit(habit.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para crear/editar hábito */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedHabit ? 'Editar Hábito' : 'Nuevo Hábito'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={habitForm.title}
            onChange={handleFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            name="description"
            value={habitForm.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Frecuencia</InputLabel>
            <Select
              label="Frecuencia"
              name="frequency"
              value={habitForm.frequency}
              onChange={handleFormChange}
            >
              <MenuItem value="Diario">Diario</MenuItem>
              <MenuItem value="Semanal">Semanal</MenuItem>
              <MenuItem value="Mensual">Mensual</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveHabit}>
            {selectedHabit ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Habits;