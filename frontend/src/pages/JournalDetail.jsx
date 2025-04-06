import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Fab,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import axios from 'axios';

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  // Cargar los datos del diario y sus entradas
  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        setLoading(true);
        // Obtener detalles del diario
        const journalResponse = await axios.get(`http://localhost:5000/journals/${id}`);
        setJournal(journalResponse.data);

        // Obtener entradas del diario
        const entriesResponse = await axios.get(`http://localhost:5000/journals/${id}/entries`);
        setEntries(entriesResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos del diario:', err);
        setError('No se pudieron cargar los datos del diario. Por favor, inténtalo de nuevo más tarde.');
        
        // Datos de ejemplo para desarrollo
        setJournal({
          id: parseInt(id),
          title: 'Diario de Desarrollo Personal',
          description: 'Mis reflexiones diarias sobre crecimiento personal y profesional',
          created_at: '2023-05-15T10:30:00',
          updated_at: '2023-06-10T18:45:00'
        });
        
        setEntries([
          {
            id: 1,
            journal_id: parseInt(id),
            title: 'Reflexión sobre mi progreso',
            content: 'Hoy he reflexionado sobre mi avance en el proyecto y me siento satisfecho con los resultados obtenidos hasta ahora...',
            mood: 'Positivo',
            created_at: '2023-06-10T18:45:00',
            tags: ['reflexión', 'progreso', 'satisfacción']
          },
          {
            id: 2,
            journal_id: parseInt(id),
            title: 'Nuevas ideas para implementar',
            content: 'Durante la sesión de brainstorming de hoy, surgieron varias ideas interesantes que me gustaría explorar más a fondo...',
            mood: 'Inspirado',
            created_at: '2023-06-05T14:30:00',
            tags: ['ideas', 'creatividad', 'proyectos']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [id]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Manejar la apertura del diálogo para crear/editar entrada
  const handleOpenDialog = (entry = null) => {
    setCurrentEntry(entry);
    setOpenDialog(true);
  };

  // Manejar eliminación de entrada
  const handleDeleteEntry = async (entryId) => {
    // Aquí iría la lógica para eliminar la entrada
    console.log('Eliminar entrada:', entryId);
  };

  // Volver a la página de diarios
  const handleGoBack = () => {
    navigate('/journals');
  };

  // Renderizar las entradas del diario
  const renderEntries = () => {
    if (entries.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <BookmarkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay entradas en este diario
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Crea tu primera entrada para comenzar a registrar tus pensamientos.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nueva Entrada
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {entries.map((entry) => (
          <Grid item xs={12} key={entry.id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div">
                    {entry.title}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(entry)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                  <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(entry.created_at)}
                  </Typography>
                  {entry.mood && (
                    <Chip 
                      label={entry.mood} 
                      size="small" 
                      sx={{ ml: 2 }}
                      color={entry.mood.toLowerCase() === 'positivo' || entry.mood.toLowerCase() === 'inspirado' ? 'success' : 'default'}
                    />
                  )}
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Typography variant="body1" paragraph>
                  {entry.content}
                </Typography>
                
                {entry.tags && entry.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {entry.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!journal && !loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          No se encontró el diario solicitado. Puede que haya sido eliminado o no tengas acceso a él.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Volver a Diarios
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabecera con información del diario */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Volver a Diarios
        </Button>
        
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {journal.title}
            </Typography>
            <IconButton 
              color="primary"
              onClick={() => console.log('Editar diario')}
            >
              <EditIcon />
            </IconButton>
          </Box>
          
          <Typography variant="body1" paragraph>
            {journal.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Creado: {formatDate(journal.created_at)}
            </Typography>
            {journal.updated_at && (
              <Typography variant="body2" color="text.secondary">
                Última actualización: {formatDate(journal.updated_at)}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Sección de entradas */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Entradas
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nueva Entrada
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderEntries()}
      </Box>

      {/* Botón flotante para crear nueva entrada */}
      <Fab 
        color="primary" 
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Aquí iría el componente de diálogo para crear/editar entradas */}
      {/* <JournalEntryDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        journalId={id}
        entry={currentEntry}
      /> */}
    </Container>
  );
};

export default JournalDetail;