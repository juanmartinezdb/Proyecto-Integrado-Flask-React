import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
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
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import JournalService from '../services/journalService';

const Journals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estado para el formulario de diario
  const [journalForm, setJournalForm] = useState({
    title: '',
    description: ''
  });

  // Cargar diarios desde la API
  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await JournalService.getAllJournals();
      setJournals(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar diarios:', error);
      setError('Error al cargar los diarios. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // Abrir diálogo para crear/editar diario
  const handleOpenDialog = (journal = null) => {
    if (journal) {
      setSelectedJournal(journal);
      setJournalForm({
        title: journal.title,
        description: journal.description
      });
    } else {
      setSelectedJournal(null);
      setJournalForm({
        title: '',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJournal(null);
  };
  
  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setJournalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Función para guardar un diario (crear o actualizar)
  const handleSaveJournal = async () => {
    try {
      if (selectedJournal) {
        // Actualizar diario existente
        const updatedJournal = await JournalService.updateJournal(selectedJournal.id, journalForm);
        setJournals(journals.map(j => 
          j.id === selectedJournal.id ? updatedJournal : j
        ));
        setSnackbarMessage('Diario actualizado correctamente');
      } else {
        // Crear nuevo diario
        const newJournal = await JournalService.createJournal(journalForm);
        setJournals([...journals, newJournal]);
        setSnackbarMessage('Diario creado correctamente');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar diario:', error);
      setSnackbarMessage('Error al guardar el diario');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  // Función para eliminar un diario
  const handleDeleteJournal = async (id) => {
    try {
      await JournalService.deleteJournal(id);
      setJournals(journals.filter(j => j.id !== id));
      setSnackbarMessage('Diario eliminado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error al eliminar diario:', error);
      setSnackbarMessage('Error al eliminar el diario');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
          Diarios
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Diario
        </Button>
      </Box>

      <Grid container spacing={3}>
        {journals.map((journal) => (
          <Grid item xs={12} sm={6} md={4} key={journal.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {journal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {journal.description}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Entradas: {journal.entryCount}
                  </Typography>
                  <Typography variant="body2">
                    Última actualización: {formatDate(journal.lastUpdated)}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/journals/${journal.id}`)}>Ver entradas</Button>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small" color="primary" onClick={() => handleOpenDialog(journal)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDeleteJournal(journal.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para crear/editar diario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedJournal ? 'Editar Diario' : 'Nuevo Diario'}
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
            value={journalForm.title}
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
            rows={4}
            name="description"
            value={journalForm.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveJournal}>
            {selectedJournal ? 'Guardar cambios' : 'Crear'}
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

export default Journals;