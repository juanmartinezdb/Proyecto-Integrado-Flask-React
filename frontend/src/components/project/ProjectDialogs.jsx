import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Link as LinkIcon
} from '@mui/icons-material';

// Componente para el diálogo de tareas
const TaskDialog = ({
  open,
  onClose,
  taskForm,
  onChange,
  onSubmit,
  editingItem
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingItem ? 'Editar Tarea' : 'Nueva Tarea'}
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={taskForm.title}
              onChange={onChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={taskForm.description}
              onChange={onChange}
              multiline
              rows={3}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha límite"
              name="due_date"
              type="date"
              value={taskForm.due_date}
              onChange={onChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Prioridad</InputLabel>
              <Select
                name="priority"
                value={taskForm.priority}
                label="Prioridad"
                onChange={onChange}
              >
                <MenuItem value="low">Baja</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                name="status"
                value={taskForm.status}
                label="Estado"
                onChange={onChange}
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="in_progress">En progreso</MenuItem>
                <MenuItem value="completed">Completada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={onSubmit}
          startIcon={editingItem ? <EditIcon /> : <AddIcon />}
        >
          {editingItem ? 'Guardar Cambios' : 'Crear Tarea'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Componente para el diálogo de hábitos
const HabitDialog = ({
  open,
  onClose,
  habitForm,
  onChange,
  onSubmit,
  editingItem
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingItem ? 'Editar Hábito' : 'Nuevo Hábito'}
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={habitForm.name}
              onChange={onChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={habitForm.description}
              onChange={onChange}
              multiline
              rows={3}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Frecuencia</InputLabel>
              <Select
                name="frequency"
                value={habitForm.frequency}
                label="Frecuencia"
                onChange={onChange}
              >
                <MenuItem value="daily">Diaria</MenuItem>
                <MenuItem value="weekly">Semanal</MenuItem>
                <MenuItem value="monthly">Mensual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={onSubmit}
          startIcon={editingItem ? <EditIcon /> : <AddIcon />}
        >
          {editingItem ? 'Guardar Cambios' : 'Crear Hábito'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Componente para el diálogo de materiales
const MaterialDialog = ({
  open,
  onClose,
  materialForm,
  onChange,
  onSubmit,
  editingItem
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingItem ? 'Editar Material' : 'Nuevo Material'}
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={materialForm.name}
              onChange={onChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={materialForm.description}
              onChange={onChange}
              multiline
              rows={3}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL"
              name="url"
              value={materialForm.url}
              onChange={onChange}
              margin="normal"
              placeholder="https://ejemplo.com"
              InputProps={{
                startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={onSubmit}
          startIcon={editingItem ? <EditIcon /> : <AddIcon />}
        >
          {editingItem ? 'Guardar Cambios' : 'Crear Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Componente principal que exporta todos los diálogos
const ProjectDialogs = {
  TaskDialog,
  HabitDialog,
  MaterialDialog
};

export default ProjectDialogs;