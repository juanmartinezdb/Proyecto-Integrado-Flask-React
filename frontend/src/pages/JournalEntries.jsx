import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import JournalService from '../services/journalService';
import JournalEntryService from '../services/journalEntryService';

const JournalEntries = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  
  const [journal, setJournal] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estado para el formulario de entrada
  const [entryForm, setEntryForm] = useState({
    content: '',
    points: 0,
    energy: 0
  });

  // Cargar diario y sus entradas
  useEffect(() => {
    const fetchJournalAndEntries = async () => {
      try {
        setLoading(true);
        // Obtener información del diario
        const journalData = await JournalService.getJournalById(journalId);
        setJournal(journalData);
        
        // Obtener entradas del diario
        const entriesData = await JournalEntryService.getEntriesByJournal(journalId);
        setEntries(entriesData || []);
        setError(null);
      } catch (error) {
        console.error('Error al cargar diario o entradas:', error);
        setError('Error al cargar la información. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (journalId) {
      fetchJournalAndEntries();
    }
  }, [journalId]);

  // Abrir diálogo para crear/editar entrada
  const handleOpenDialog = (entry = null) => {
    if (entry) {
      setSelectedEntry(entry);
      setEntryForm({
        content: entry.content,
        points: entry.points || 0,
        energy: entry.energy || 0
      });
    } else {
      setSelectedEntry(null);
      setEntryForm({
        content: '',
        points: 0,
        energy: 0
      });
    }
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEntry(null);
  };
  
  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEntryForm(prev => ({
      ...prev,
      [name]: name === 'content' ? value : Number(value)
    }));
  };
  
  // Función para guardar una entrada (crear o actualizar)
  const handleSaveEntry = async () => {
    try {
      if (selectedEntry) {
        // Actualizar entrada existente
        const updatedEntry = await JournalEntryService.updateEntry(
          journalId, 
          selectedEntry.id, 
          entryForm
        );
        setEntries(entries.map(e => 
          e.id === selectedEntry.id ? updatedEntry : e
        ));
        setSnackbarMessage('Entrada actualizada correctamente');
      } else {
        // Crear nueva entrada
        const newEntry = await JournalEntryService.createEntry(journalId, entryForm);
        setEntries([...entries, newEntry]);
        setSnackbarMessage('Entrada creada correctamente');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar entrada:', error);
      setSnackbarMessage('Error al guardar la entrada');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Función para eliminar una entrada
  const handleDeleteEntry = async (entryId) => {
    try {
      await JournalEntryService.deleteEntry(journalId, entryId);
      setEntries(entries.filter(e => e.id !== entryId));
      setSnackbarMessage('Entrada eliminada correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al eliminar entrada:', error);
      setSnackbarMessage('Error al eliminar la entrada');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Volver a la página de diarios
  const handleGoBack = () => {
    navigate('/journals');
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {journal?.title || 'Diario'}
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          {journal?.description || 'Sin descripción'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Entradas: {entries.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Racha actual: {journal?.streak || 0} días
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Entradas
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Entrada
        </Button>
      </Box>

      {entries.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No hay entradas en este diario. ¡Crea la primera!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {entries.map((entry) => (
            <Grid item xs={12} key={entry.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(entry.edited_at)}
                    </Typography>
                    <Box>
                      <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                        Energía: {entry.energy}
                      </Typography>
                      <Typography variant="body2" component="span">
                        Puntos: {entry.points}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {entry.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box sx={{ ml: 'auto' }}>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(entry)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteEntry(entry.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo para crear/editar entrada */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEntry ? 'Editar Entrada' : 'Nueva Entrada'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Contenido"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={6}
            name="content"
            value={entryForm.content}
            onChange={handleFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Puntos"
                type="number"
                fullWidth
                variant="outlined"
                name="points"
                value={entryForm.points}
                onChange={handleFormChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Energía"
                type="number"
                fullWidth
                variant="outlined"
                name="energy"
                value={entryForm.energy}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEntry}>
            {selectedEntry ? 'Guardar cambios' : 'Crear'}
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

export default JournalEntries;