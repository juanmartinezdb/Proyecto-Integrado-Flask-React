import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Tema base con la paleta de colores de fantasía
const baseTheme = {
  palette: {
    primary: {
      main: '#6a4dbc', // Púrpura
      light: '#9179ef',
      dark: '#4a348c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f0e6d2', // Beige claro
      light: '#fffcf5',
      dark: '#c1b4a1',
      contrastText: '#333333',
    },
    accent: {
      main: '#ffcc33', // Dorado
      light: '#ffe066',
      dark: '#cc9900',
      contrastText: '#333333',
    },
    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      light: '#6ec6ff',
      dark: '#0069c0',
      contrastText: '#ffffff',
    },
    energy: {
      negative: '#3b82f6', // Azul frío
      balanced: '#10b981', // Verde equilibrado
      positive: '#ef4444', // Rojo cálido
    },
    background: {
      default: '#f8f5f0', // Fondo claro pero no blanco puro
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
};

export const ThemeProvider = ({ children }) => {
  // Estado para el tema actual
  const [themeMode, setThemeMode] = useState('light');
  const [zoneColor, setZoneColor] = useState(null);

  // Crear tema con colores de zona si está disponible
  const currentTheme = useMemo(() => {
    let themeConfig = { ...baseTheme };
    
    // Si hay un color de zona seleccionado, actualizar el tema
    if (zoneColor) {
      themeConfig.palette.primary.main = zoneColor;
      // Ajustar colores derivados
      themeConfig.palette.primary.light = adjustColor(zoneColor, 20); // más claro
      themeConfig.palette.primary.dark = adjustColor(zoneColor, -20); // más oscuro
    }
    
    return createTheme(themeConfig);
  }, [themeMode, zoneColor]);

  // Función para ajustar el brillo de un color
  const adjustColor = (hex, percent) => {
    // Implementación simple para ajustar el brillo
    // En una implementación real, usaría una biblioteca como color o tinycolor2
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const adjustValue = (value) => {
      const adjusted = value + (value * percent / 100);
      return Math.min(255, Math.max(0, Math.round(adjusted)));
    };
    
    const nr = adjustValue(r);
    const ng = adjustValue(g);
    const nb = adjustValue(b);
    
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  };

  // Cambiar el tema según la zona seleccionada
  const changeZoneTheme = (color) => {
    setZoneColor(color);
  };

  const value = {
    currentTheme,
    themeMode,
    setThemeMode,
    changeZoneTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};