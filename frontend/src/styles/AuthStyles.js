import { alpha } from '@mui/material/styles';

export const authStyles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    padding: '20px 0',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
      pointerEvents: 'none',
    },
    '@keyframes gradient': {
      '0%': {
        backgroundPosition: '0% 50%',
      },
      '50%': {
        backgroundPosition: '100% 50%',
      },
      '100%': {
        backgroundPosition: '0% 50%',
      },
    },
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '40px 30px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    animation: 'fadeIn 0.5s ease-out',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    maxWidth: '450px',
    width: '100%',
    margin: 'auto',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '200%',
      height: '4px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
      animation: 'shimmer 2s infinite',
    },
    '@keyframes fadeIn': {
      from: {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    '@keyframes shimmer': {
      '0%': {
        transform: 'translateX(-100%)',
      },
      '100%': {
        transform: 'translateX(100%)',
      },
    },
  },
  avatar: {
    margin: '0 auto 24px auto',
    width: 70,
    height: 70,
    backgroundColor: '#3b82f6',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
    transform: 'scale(1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) rotate(5deg)',
      backgroundColor: '#2563eb',
      boxShadow: '0 12px 20px rgba(59, 130, 246, 0.4)',
    },
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '32px',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
      },
      '&.Mui-focused': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3b82f6',
          borderWidth: '2px',
        },
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#3b82f6',
      },
    },
    mb: 2,
  },
  submitButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    borderRadius: '12px',
    border: 0,
    color: 'white',
    height: '48px',
    padding: '0 30px',
    fontWeight: 600,
    fontSize: '1.1rem',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 20px rgba(59, 130, 246, 0.4)',
    },
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '8px',
    '&:hover': {
      color: '#2563eb',
      textDecoration: 'none',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      transform: 'translateY(-1px)',
    },
  },
  errorAlert: {
    borderRadius: '12px',
    marginBottom: '24px',
    animation: 'slideIn 0.5s ease-out',
    '@keyframes slideIn': {
      from: {
        opacity: 0,
        transform: 'translateY(-20px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  inputAdornment: {
    color: 'rgba(0, 0, 0, 0.54)',
    '&:hover': {
      color: '#4f46e5',
    },
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: '-8px',
    marginBottom: '16px',
  },
  divider: {
    margin: '24px 0',
    '&::before, &::after': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  socialButton: {
    borderRadius: '12px',
    padding: '8px 24px',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
}; 