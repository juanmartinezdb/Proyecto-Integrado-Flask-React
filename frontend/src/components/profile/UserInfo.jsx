import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const UserInfo = ({ user, onEdit }) => {
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Grid container spacing={3}>
        {/* Avatar y nombre */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={user?.avatar || '/static/images/avatar/default.jpg'}
            alt={user?.username}
            sx={{ width: 120, height: 120, mb: 2, border: '3px solid', borderColor: 'primary.main' }}
          />
          <Typography variant="h5" gutterBottom>
            {user?.username || 'Usuario'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {user?.title || 'Aventurero Novato'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            size="small"
            onClick={onEdit}
            sx={{ mt: 1 }}
          >
            Editar Perfil
          </Button>
        </Grid>
        
        {/* Información personal */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Información Personal
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" paragraph>
              {user?.bio || 'No hay biografía disponible.'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            {user?.email && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {user.email}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {user?.birthdate && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CakeIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {formatDate(user.birthdate)}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {user?.location && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {user.location}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          {/* Etiquetas de intereses */}
          {user?.interests && user.interests.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Intereses
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.interests.map((interest, index) => (
                  <Chip key={index} label={interest} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserInfo;