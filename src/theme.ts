import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4263EB',
      light: '#748FFC',
      dark: '#364FC7',
      contrastText: '#fff',
    },
    secondary: {
      main: '#495057',
      light: '#868E96',
      dark: '#343A40',
      contrastText: '#fff',
    },
    error: {
      main: '#FA5252',
      light: '#FF8787',
      dark: '#E03131',
      contrastText: '#fff',
    },
    warning: {
      main: '#FCC419',
      light: '#FFE066',
      dark: '#F59F00',
      contrastText: '#000',
    },
    info: {
      main: '#228BE6',
      light: '#74C0FC',
      dark: '#1971C2',
      contrastText: '#fff',
    },
    success: {
      main: '#40C057',
      light: '#8CE99A',
      dark: '#2F9E44',
      contrastText: '#fff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
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
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme; 