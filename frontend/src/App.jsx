import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';

// Páginas
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Projects from './pages/Projects';
import ProjectTasks from './pages/ProjectTasks';
import Habits from './pages/Habits';
import Journals from './pages/Journals';
import JournalEntries from './pages/JournalEntries';
import Materials from './pages/Materials';
import Store from './pages/Store';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Register from './pages/Register';

// Contextos
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ZoneProvider } from './contexts/ZoneContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Componente de rutas protegidas
const ProtectedRoutes = () => {
  const { currentUser, loading } = useAuth();
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();
  
  if (loading) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout isMobile={isMobile} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="projects" element={<Projects />} />\n        <Route path="projects/:projectId/tasks" element={<ProjectTasks />} />
        <Route path="habits" element={<Habits />} />
        <Route path="journals" element={<Journals />} />
        <Route path="journals/:journalId" element={<JournalEntries />} />
        <Route path="materials" element={<Materials />} />
        <Route path="store" element={<Store />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ZoneProvider>
          <NotificationProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rutas protegidas */}
                <Route path="/*" element={<ProtectedRoutes />} />
              </Routes>
            </Box>
          </NotificationProvider>
        </ZoneProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;