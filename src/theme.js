import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // your main blue
    },
    secondary: {
      main: '#9c27b0', // your secondary color
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
