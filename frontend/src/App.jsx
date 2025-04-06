import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Habits from './pages/Habits';
import Journals from './pages/Journals';
import JournalDetail from './pages/JournalDetail';
import Materials from './pages/Materials';
import Store from './pages/Store';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentTheme } = useTheme();
  const location = useLocation();

  // Proteger rutas que requieren autenticación
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
  };

  // Redirigir a dashboard si ya está autenticado
  const PublicRoute = ({ children }) => {
    if (loading) return <div>Cargando...</div>;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return children;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: currentTheme.palette.background.default,
      color: currentTheme.palette.text.primary
    }}>
      <CssBaseline />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Rutas protegidas dentro del layout principal */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="habits" element={<Habits />} />
          <Route path="journals" element={<Journals />} />
          <Route path="journals/:id" element={<JournalDetail />} />
          <Route path="materials" element={<Materials />} />
          <Route path="store" element={<Store />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default App;