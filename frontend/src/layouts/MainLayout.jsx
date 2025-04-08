import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Componentes del layout
import TopNavBar from '../components/navigation/TopNavBar';
import EnergyBar from '../components/energy/EnergyBar';
import LeftSidebar from '../components/sidebar/LeftSidebar';

// Contextos
import { useZone } from '../contexts/ZoneContext';

const MainLayout = ({ isMobile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentZone } = useZone();
  
  // Ajustar el sidebar cuando cambia el tamaño de la pantalla
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Calcular el color de tema basado en la zona actual
  const getZoneThemeColor = () => {
    if (!currentZone || !currentZone.color) return theme.palette.primary.main;
    return currentZone.color;
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: theme.palette.background.default
    }}>
      {/* Barra de navegación superior */}
      <TopNavBar 
        toggleSidebar={toggleSidebar} 
        zoneColor={getZoneThemeColor()}
      />
      
      {/* Barra de energía (componente de alta prioridad) */}
      <EnergyBar />
      
      {/* Contenedor principal con sidebar y contenido */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Sidebar izquierdo */}
        <LeftSidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          zoneColor={getZoneThemeColor()}
        />
        
        {/* Área de contenido principal */}
        <Box 
          component="main" 
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            transition: theme.transitions.create(['margin', 'padding'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            marginLeft: 0,
            ...(sidebarOpen && isDesktop && {
              transition: theme.transitions.create(['margin', 'padding'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              marginLeft: '280px',
            }),
            overflowY: 'auto',
            height: 'calc(100vh - 128px)', // Altura total - (navbar + energybar)
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.4),
            }
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;