import React from 'react';
import {
  Box,
  Typography,
  List,
  Paper,
  Button,
  Divider
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onAddTask, onEditTask, onDeleteTask, onStatusChange }) => {
  // Ordenar tareas: primero pendientes, luego en progreso, finalmente completadas
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Tareas ({tasks.length})
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddTask}
        >
          Nueva Tarea
        </Button>
      </Box>
      
      <Divider />
      
      {tasks.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No hay tareas en este proyecto.
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {sortedTasks.map((task) => (
            <React.Fragment key={task.id}>
              <TaskItem
                task={task}
                onStatusChange={onStatusChange}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TaskList;