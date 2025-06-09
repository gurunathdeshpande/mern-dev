import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../context/AuthContext';
import { authStyles } from '../styles/AuthStyles';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Reset error state
      setError('');
    
    // Client-side validation
      if (!email?.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    // Email validation
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
      // Start loading
      setLoading(true);

      // Attempt login
      const userData = await login(email, password);
      
      if (!userData) {
        throw new Error('No user data received from server');
      }

      // Clear form
      setEmail('');
      setPassword('');
      
      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={authStyles.pageContainer}>
    <Container component="main" maxWidth="xs">
        <Box sx={authStyles.formContainer}>
          <Avatar sx={authStyles.avatar}>
          <LockOutlinedIcon />
        </Avatar>
          <Typography component="h1" variant="h5" sx={authStyles.title}>
            Welcome Back
        </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: '10px',
                  animation: 'fadeIn 0.5s ease-out'
                }}
              >
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={authStyles.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
              type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={authStyles.textField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
              sx={{
                ...authStyles.submitButton,
                mt: 3,
                mb: 2,
              }}
            disabled={loading}
          >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2"
                  sx={authStyles.link}
                >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </Box>
  );
}

export default Login; 