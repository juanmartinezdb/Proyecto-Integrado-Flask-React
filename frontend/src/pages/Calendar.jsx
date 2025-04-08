import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';

const Calendar = () => {
  // Estado para almacenar eventos
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    description: ''
  });
  
  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Obtener eventos de la agenda
        const response = await api.get('/agenda/view?period=monthly');
        if (response.data && Array.isArray(response.data.items)) {
          // Transformar los datos al formato que necesitamos
          const formattedEvents = response.data.items.map(item => ({
            id: item.id,
            title: item.title || item.name,
            date: item.date || item.start_date,
            time: item.time || '00:00',
            description: item.description || '',
            type: item.type // task, habit, project
          }));
          setEvents(formattedEvents);
        } else {
          // Si no hay datos o el formato es incorrecto, usar eventos de ejemplo
          setEvents([
            { id: 1, title: 'Reunión de proyecto', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'task' },
            { id: 2, title: 'Entrega de informe', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '15:00', type: 'task' },
            { id: 3, title: 'Revisión de código', date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], time: '11:30', type: 'task' },
          ]);
        }
        setError(null);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        setError('No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.');
        // Usar eventos de ejemplo en caso de error
        setEvents([
          { id: 1, title: 'Reunión de proyecto', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'task' },
          { id: 2, title: 'Entrega de informe', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '15:00', type: 'task' },
          { id: 3, title: 'Revisión de código', date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], time: '11:30', type: 'task' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Función para generar el calendario del mes actual
  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const calendarDays = [];
    
    // Agregar días vacíos para alinear el primer día del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<Grid item xs={1.7} key={`empty-${i}`}>
        <Paper sx={{ p: 2, height: 80, bgcolor: 'background.default', border: '1px dashed grey.300' }} />
      </Grid>);
    }
    
    // Agregar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === date);
      
      calendarDays.push(
        <Grid item xs={1.7} key={day}>
          <Paper sx={{
            p: 2,
            height: 80,
            position: 'relative',
            bgcolor: today.getDate() === day ? 'primary.light' : 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}>
            <Typography variant="body2" sx={{ position: 'absolute', top: 5, left: 5 }}>
              {day}
            </Typography>
            {dayEvents.map(event => (
              <Typography 
                key={event.id} 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 3, 
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                {event.time} - {event.title}
              </Typography>
            ))}
          </Paper>
        </Grid>
      );
    }
    
    return calendarDays;
  };

  // Manejar cambios en el formulario de nuevo evento
  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Crear un nuevo evento
  const handleCreateEvent = async () => {
    try {
      // En una implementación real, aquí se enviaría el evento a la API
      // Por ahora, simplemente lo agregamos al estado local
      const newId = Math.max(...events.map(e => e.id), 0) + 1;
      const createdEvent = {
        ...newEvent,
        id: newId,
        type: 'task'
      };
      
      setEvents([...events, createdEvent]);
      setOpenDialog(false);
      setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        description: ''
      });
    } catch (error) {
      console.error('Error al crear evento:', error);
    }
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
          Calendario
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nuevo Evento
        </Button>
      </Box>
      
      {/* Días de la semana */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
          <Grid item xs={1.7} key={index}>
            <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="body2">{day}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Calendario */}
      <Grid container spacing={1}>
        {generateCalendar()}
      </Grid>
      
      {/* Diálogo para crear nuevo evento */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Crear Nuevo Evento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={newEvent.title}
            onChange={handleEventFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="date"
            label="Fecha"
            type="date"
            fullWidth
            variant="outlined"
            value={newEvent.date}
            onChange={handleEventFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="time"
            label="Hora"
            type="time"
            fullWidth
            variant="outlined"
            value={newEvent.time}
            onChange={handleEventFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newEvent.description}
            onChange={handleEventFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateEvent} variant="contained" color="primary">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;