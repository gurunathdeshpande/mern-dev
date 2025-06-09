import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Indigo
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#EC4899', // Pink
      light: '#F472B6',
      dark: '#BE185D',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444', // Red
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3B82F6', // Blue
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      secondary: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      light: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      dark: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.1)',
    '0px 2px 4px rgba(15, 23, 42, 0.08)',
    '0px 4px 8px rgba(15, 23, 42, 0.08)',
    '0px 8px 16px rgba(15, 23, 42, 0.08)',
    '0px 16px 24px rgba(15, 23, 42, 0.08)',
    '0px 24px 32px rgba(15, 23, 42, 0.08)',
    '0px 32px 40px rgba(15, 23, 42, 0.08)',
    '0px 40px 48px rgba(15, 23, 42, 0.08)',
    '0px 48px 56px rgba(15, 23, 42, 0.08)',
    '0px 56px 64px rgba(15, 23, 42, 0.08)',
    '0 1px 3px rgba(15, 23, 42, 0.12), 0 1px 2px rgba(15, 23, 42, 0.24)',
    '0 3px 6px rgba(15, 23, 42, 0.15), 0 2px 4px rgba(15, 23, 42, 0.12)',
    '0 10px 20px rgba(15, 23, 42, 0.15), 0 3px 6px rgba(15, 23, 42, 0.1)',
    '0 14px 28px rgba(15, 23, 42, 0.25), 0 10px 10px rgba(15, 23, 42, 0.22)',
    '0 19px 38px rgba(15, 23, 42, 0.3), 0 15px 12px rgba(15, 23, 42, 0.22)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 8px rgba(15, 23, 42, 0.08)',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
}); 