import { createTheme } from '@mui/material/styles';

// Tema personalizado inspirado en RPG de fantasía
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4a6da7', // Azul estrella polar
      light: '#6b8fd9',
      dark: '#2a4d77',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#b39ddb', // Púrpura suave
      light: '#d1c4e9',
      dark: '#7e57c2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa', // Fondo claro pero no blanco puro
      paper: '#ffffff',
    },
    error: {
      main: '#e57373',
      light: '#ef9a9a',
      dark: '#c62828',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffe0b2',
      dark: '#f57c00',
    },
    info: {
      main: '#64b5f6',
      light: '#bbdefb',
      dark: '#1976d2',
    },
    success: {
      main: '#81c784',
      light: '#c8e6c9',
      dark: '#388e3c',
    },
    energy: {
      negative: '#5e35b1', // Púrpura/azul para energía negativa
      balanced: '#66bb6a', // Verde para energía equilibrada
      positive: '#ff7043', // Naranja/rojo para energía positiva
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
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
      fontWeight: 600,
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
        contained: {
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;