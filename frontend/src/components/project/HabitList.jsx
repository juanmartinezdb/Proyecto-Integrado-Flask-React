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
import HabitItem from './HabitItem';

const HabitList = ({ habits, onAddHabit, onEditHabit, onDeleteHabit }) => {
  return (
    <Paper elevation={1} sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Hábitos ({habits.length})
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddHabit}
        >
          Nuevo Hábito
        </Button>
      </Box>
      
      <Divider />
      
      {habits.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No hay hábitos en este proyecto.
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {habits.map((habit) => (
            <React.Fragment key={habit.id}>
              <HabitItem
                habit={habit}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default HabitList;