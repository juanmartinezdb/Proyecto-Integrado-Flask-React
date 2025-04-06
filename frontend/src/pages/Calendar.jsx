import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Today as TodayIcon,
  Event as EventIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
  Loop as HabitIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Componente para mostrar un día del calendario
const CalendarDay = ({ day, month, year, events, isToday, onClick }) => {
  const hasEvents = events && events.length > 0;
  
  return (
    <Paper 
      elevation={isToday ? 3 : 1} 
      sx={{
        height: 100,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: isToday ? '2px solid' : 'none',
        borderColor: isToday ? 'primary.main' : 'transparent',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
      onClick={() => onClick(day, month, year)}
    >
      <Typography 
        variant="subtitle1" 
        sx={{
          fontWeight: isToday ? 'bold' : 'normal',
          color: isToday ? 'primary.main' : 'text.primary'
        }}
      >
        {day}
      </Typography>
      
      {hasEvents && (
        <Box sx={{ mt: 'auto', overflow: 'hidden' }}>
          {events.slice(0, 2).map((event, index) => (
            <Chip
              key={index}
              size="small"
              label={event.title}
              sx={{
                mb: 0.5,
                maxWidth: '100%',
                backgroundColor: event.type === 'task' ? 'primary.light' : 'success.light',
                '& .MuiChip-label': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              }}
            />
          ))}
          {events.length > 2 && (
            <Typography variant="caption" color="text.secondary">
              +{events.length - 2} más
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

const Calendar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Estados para el calendario
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'task',
    date: '',
    project_id: ''
  });
  const [projects, setProjects] = useState([]);
  
  // Obtener datos del calendario
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        
        // Obtener eventos del mes actual
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // API espera mes 1-12
        
        const eventsResponse = await axios.get(`http://localhost:5000/calendar/events?year=${year}&month=${month}`);
        
        // Obtener proyectos para el formulario de nuevo evento
        const projectsResponse = await axios.get('http://localhost:5000/projects');
        setProjects(projectsResponse.data.items || []);
        
        // Procesar datos del calendario
        processCalendarData(year, month, eventsResponse.data.events || []);
        
      } catch (err) {
        console.error('Error al obtener datos del calendario:', err);
        setError('No se pudieron cargar los eventos del calendario');
        
        // Datos de ejemplo para desarrollo
        const dummyEvents = [
          { id: 1, title: 'Reunión de equipo', type: 'task', date: '2023-05-15', project_id: 1 },
          { id: 2, title: 'Entrega de proyecto', type: 'task', date: '2023-05-20', project_id: 1 },
          { id: 3, title: 'Meditar', type: 'habit', date: '2023-05-10', project_id: null },
          { id: 4, title: 'Ejercicio', type: 'habit', date: '2023-05-12', project_id: null },
          { id: 5, title: 'Planificación semanal', type: 'task', date: '2023-05-08', project_id: 2 }
        ];
        
        const dummyProjects = [
          { id: 1, name: 'Proyecto Web' },
          { id: 2, name: 'Rediseño' },
          { id: 3, name: 'Consultoría' }
        ];
        
        setProjects(dummyProjects);
        processCalendarData(year, month, dummyEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentDate]);

  // Procesar datos del calendario
  const processCalendarData = (year, month, events) => {
    // Obtener el primer día del mes y el número de días
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Crear matriz de días del mes
    const days = [];
    let week = [];
    
    // Añadir días vacíos al principio
    for (let i = 0; i < adjustedFirstDay; i++) {
      week.push(null);
    }
    
    // Añadir días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      // Filtrar eventos para este día
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month - 1 && 
               eventDate.getFullYear() === year;
      });
      
      week.push({
        day,
        events: dayEvents
      });
      
      // Si es el último día de la semana o del mes, añadir la semana al calendario
      if ((adjustedFirstDay + day) % 7 === 0 || day === daysInMonth) {
        days.push([...week]);
        week = [];
      }
    }
    
    setCalendarData(days);
  };

  // Manejar cambio de mes
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Manejar selección de día
  const handleDayClick = (day, month, year) => {
    if (!day) return; // Ignorar celdas vacías
    
    const clickedDate = new Date(year, month - 1, day);
    setSelectedDate(clickedDate);
    
    // Filtrar eventos para el día seleccionado
    const events = calendarData
      .flat()
      .filter(item => item && item.day === day)
      .map(item => item.events || [])
      .flat();
    
    setSelectedDateEvents(events);
  };

  // Manejar diálogo de nuevo evento
  const handleOpenEventDialog = () => {
    // Establecer la fecha seleccionada en el formulario
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setNewEvent(prev => ({ ...prev, date: formattedDate }));
    }
    setOpenEventDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    // Resetear formulario
    setNewEvent({
      title: '',
      description: '',
      type: 'task',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      project_id: ''
    });
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEvent = async () => {
    try {
      // Validar campos requeridos
      if (!newEvent.title || !newEvent.date) {
        alert('Por favor completa los campos requeridos');
        return;
      }
      
      // Enviar datos al backend
      const endpoint = newEvent.type === 'task' ? 'tasks' : 'habits';
      await axios.post(`http://localhost:5000/${endpoint}`, newEvent);
      
      // Cerrar diálogo y recargar datos
      handleCloseEventDialog();
      
      // Recargar datos del mes actual
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const eventsResponse = await axios.get(`http://localhost:5000/calendar/events?year=${year}&month=${month}`);
      processCalendarData(year, month, eventsResponse.data.events || []);
      
      // Actualizar eventos del día seleccionado
      if (selectedDate) {
        handleDayClick(selectedDate.getDate(), selectedDate.getMonth() + 1, selectedDate.getFullYear());
      }
      
    } catch (err) {
      console.error('Error al crear evento:', err);
      alert('Error al crear el evento. Inténtalo de nuevo.');
    }
  };

  // Formatear nombre del mes
  const formatMonth = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  // Comprobar si un día es hoy
  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month - 1 === today.getMonth() && 
           year === today.getFullYear();
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Encabezado del Calendario */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Calendario
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<TodayIcon />} 
            onClick={() => setCurrentDate(new Date())}
            sx={{ mr: 1 }}
          >
            Hoy
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenEventDialog}
          >
            Nuevo Evento
          </Button>
        </Box>
      </Box>
      
      {/* Navegación del mes */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={handlePrevMonth}>
          <EventIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant="h6">
          {formatMonth(currentDate)}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <EventIcon />
        </IconButton>
      </Paper>
      
      {/* Rejilla del calendario */}
      <Grid container spacing={0} sx={{ mb: 3 }}>
        {/* Encabezados de días de la semana */}
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
          <Grid item xs key={day} sx={{ p: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight="medium">
              {day}
            </Typography>
          </Grid>
        ))}
        
        {/* Días del mes */}
        {calendarData.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => (
              <Grid item xs key={`${weekIndex}-${dayIndex}`} sx={{ p: 0.5 }}>
                {day ? (
                  <CalendarDay 
                    day={day.day}
                    month={currentDate.getMonth() + 1}
                    year={currentDate.getFullYear()}
                    events={day.events}
                    isToday={isToday(day.day, currentDate.getMonth() + 1, currentDate.getFullYear())}
                    onClick={handleDayClick}
                  />
                ) : (
                  <Box sx={{ height: 100 }} />
                )}
              </Grid>
            ))}
          </React.Fragment>
        ))}
      </Grid>
      
      {/* Eventos del día seleccionado */}
      {selectedDate && (
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Eventos para {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Typography>
            }
            action={
              <Button 
                variant="contained" 
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenEventDialog}
              >
                Añadir
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <List>
                {selectedDateEvents.map((event) => (
                  <ListItem 
                    key={event.id}
                    secondaryAction={
                      <Chip 
                        size="small" 
                        label={event.type === 'task' ? 'Tarea' : 'Hábito'}
                        color={event.type === 'task' ? 'primary' : 'success'}
                      />
                    }
                  >
                    <ListItemIcon>
                      {event.type === 'task' ? <TaskIcon color="primary" /> : <HabitIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={event.title}
                      secondary={event.description || 'Sin descripción'}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No hay eventos para este día
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Diálogo para crear nuevo evento */}
      <Dialog open={openEventDialog} onClose={handleCloseEventDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Crear Nuevo Evento
            <IconButton edge="end" color="inherit" onClick={handleCloseEventDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Título"
              name="title"
              value={newEvent.title}
              onChange={handleEventChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Descripción"
              name="description"
              multiline
              rows={3}
              value={newEvent.description}
              onChange={handleEventChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Tipo</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={newEvent.type}
                label="Tipo"
                onChange={handleEventChange}
              >
                <MenuItem value="task">Tarea</MenuItem>
                <MenuItem value="habit">Hábito</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="date"
              label="Fecha"
              name="date"
              type="date"
              value={newEvent.date}
              onChange={handleEventChange}
              InputLabelProps={{ shrink: true }}
            />
            {newEvent.type === 'task' && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="project-label">Proyecto</InputLabel>
                <Select
                  labelId="project-label"
                  id="project_id"
                  name="project_id"
                  value={newEvent.project_id}
                  label="Proyecto"
                  onChange={handleEventChange}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventDialog}>Cancelar</Button>
          <Button onClick={handleSubmitEvent} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;