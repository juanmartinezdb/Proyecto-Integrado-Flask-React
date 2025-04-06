import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  IconButton,
  Fab,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente principal para la página de diarios
const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);

  // Cargar los diarios del usuario
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/journals');
        setJournals(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los diarios:', err);
        setError('No se pudieron cargar los diarios. Por favor, inténtalo de nuevo más tarde.');
        // Datos de ejemplo para desarrollo
        setJournals([
          {
            id: 1,
            title: 'Diario de Desarrollo Personal',
            description: 'Mis reflexiones diarias sobre crecimiento personal y profesional',
            created_at: '2023-05-15T10:30:00',
            entries_count: 15,
            last_entry_date: '2023-06-10T18:45:00'
          },
          {
            id: 2,
            title: 'Registro de Proyectos',
            description: 'Seguimiento de ideas y avances en mis proyectos personales',
            created_at: '2023-04-20T14:15:00',
            entries_count: 8,
            last_entry_date: '2023-06-05T09:20:00'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Manejar la apertura del diálogo para crear/editar
  const handleOpenDialog = (journal = null) => {
    setCurrentJournal(journal);
    setOpenDialog(true);
  };

  // Renderizar tarjetas de diarios
  const renderJournalCards = () => {
    if (journals.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes diarios todavía
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Crea tu primer diario para comenzar a registrar tus pensamientos y experiencias.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Crear Diario
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {journals.map((journal) => (
          <Grid item xs={12} sm={6} md={4} key={journal.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {journal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {journal.description}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Entradas: {journal.entries_count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creado: {formatDate(journal.created_at)}
                  </Typography>
                </Box>
                {journal.last_entry_date && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Última entrada: {formatDate(journal.last_entry_date)}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/journals/${journal.id}`}
                >
                  Ver Entradas
                </Button>
                <Box sx={{ ml: 'auto' }}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenDialog(journal)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteJournal(journal.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Manejar eliminación de diario
  const handleDeleteJournal = async (journalId) => {
    // Aquí iría la lógica para eliminar el diario
    console.log('Eliminar diario:', journalId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Diarios
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Diario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderJournalCards()
      )}

      {/* Botón flotante para crear nuevo diario */}
      <Fab 
        color="primary" 
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Aquí iría el componente de diálogo para crear/editar diarios */}
      {/* <JournalDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        journal={currentJournal}
      /> */}
    </Container>
  );
};

export default Journals;