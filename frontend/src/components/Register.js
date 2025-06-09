import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';
import { keyframes } from '@mui/system';

const departments = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
];

// Define animations
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Add form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    academicYear: '',
    department: '',
  });

  const [validFields, setValidFields] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    studentId: false,
    academicYear: false,
    department: false
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateStudentId = (studentId) => {
    return /^\d{8}$/.test(studentId);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validateUsername = (username) => {
    return username.trim().length >= 3;
  };

  // Update validation status when form data changes
  useEffect(() => {
    setValidFields({
      firstName: validateName(formData.firstName),
      lastName: validateName(formData.lastName),
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: formData.password === formData.confirmPassword && formData.confirmPassword !== '',
      studentId: role === 'student' ? validateStudentId(formData.studentId) : true,
      academicYear: role === 'student' ? Boolean(formData.academicYear) : true,
      department: role === 'teacher' ? Boolean(formData.department) : true
    });
  }, [formData, role]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    // Reset role-specific fields when role changes
    setFormData(prev => ({
      ...prev,
      studentId: '',
      academicYear: '',
      department: '',
    }));
  };

  // Calculate form completion progress
  useEffect(() => {
    let filledFields = 0;
    let totalFields = 6; // firstName, lastName, username, email, password, confirmPassword

    // Check common fields
    if (formData.firstName) filledFields++;
    if (formData.lastName) filledFields++;
    if (formData.username) filledFields++;
    if (formData.email) filledFields++;
    if (formData.password) filledFields++;
    if (formData.confirmPassword) filledFields++;

    // Add role-specific fields
    if (role === 'student') {
      totalFields += 2; // studentId and academicYear
      if (formData.studentId) filledFields++;
      if (formData.academicYear) filledFields++;
    } else if (role === 'teacher') {
      totalFields += 1; // department
      if (formData.department) filledFields++;
    }

    const progress = (filledFields / totalFields) * 100;
    setFormProgress(progress);
  }, [formData, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    try {
      // Reset error state
      setError('');
      setLoading(true);
    
      // Client-side validation
      const validationErrors = [];
    
      // Required fields validation
      const requiredFields = ['username', 'email', 'password', 'confirmPassword', 'firstName', 'lastName'];
      requiredFields.forEach(field => {
        if (!data.get(field)?.trim()) {
          validationErrors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      });

      // Password validation
      const password = data.get('password');
      if (password && password.length < 6) {
        validationErrors.push('Password must be at least 6 characters long');
      }

      if (password !== data.get('confirmPassword')) {
        validationErrors.push('Passwords do not match');
      }

      // Email validation
      const email = data.get('email');
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (email && !emailRegex.test(email)) {
        validationErrors.push('Please enter a valid email address');
      }

      // Role-specific validation
      if (role === 'student') {
        const studentId = data.get('studentId')?.trim();
        // Log the studentId for debugging
        console.log('Student ID:', studentId, 'Length:', studentId?.length);
        
        if (!studentId) {
          validationErrors.push('Student ID is required');
        } else {
          // Remove any non-digit characters and check length
          const cleanStudentId = studentId.replace(/\D/g, '');
          console.log('Cleaned Student ID:', cleanStudentId, 'Length:', cleanStudentId.length);
          
          if (cleanStudentId.length !== 8) {
            validationErrors.push('Student ID must be exactly 8 digits');
          } else {
            // Update the form data with cleaned student ID
            data.set('studentId', cleanStudentId);
          }
        }
        
        if (!data.get('academicYear')) {
          validationErrors.push('Academic Year is required');
        }
      } else if (role === 'teacher') {
        if (!data.get('department')) {
          validationErrors.push('Department is required');
        }
      }

      if (validationErrors.length > 0) {
        setError(validationErrors.join('. '));
        setLoading(false);
        return;
      }

      const userData = {
        username: data.get('username').trim(),
        email: data.get('email').trim().toLowerCase(),
        password: data.get('password'),
        role: role,
        firstName: data.get('firstName').trim(),
        lastName: data.get('lastName').trim(),
      };

      if (role === 'student') {
        userData.studentId = data.get('studentId').trim().replace(/\D/g, ''); // Clean the student ID again
        userData.academicYear = parseInt(data.get('academicYear'), 10);
      } else if (role === 'teacher') {
        userData.department = data.get('department');
      }

      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes('studentId already exists')) {
        setError('This Student ID is already registered. Please use a different Student ID or contact support if you think this is a mistake.');
      } else {
        setError('Failed to create account. Please check all required fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add controlled input handling for student ID
  const handleStudentIdChange = (e) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    // Limit to 8 digits
    const truncatedValue = value.slice(0, 8);
    setFormData(prev => ({
      ...prev,
      studentId: truncatedValue
    }));
  };

  // Helper function for input props
  const getInputProps = (fieldName) => ({
    endAdornment: validFields[fieldName] && (
      <InputAdornment position="end">
        <CheckCircleIcon color="success" />
      </InputAdornment>
    )
  });

  return (
      <Box
        sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FFFFFF" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          backgroundSize: '24px 24px',
          animation: `${shimmer} 60s linear infinite`,
        },
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.01)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              transform: `scaleX(${formProgress / 100})`,
              transformOrigin: 'left',
              transition: 'transform 0.3s ease-in-out',
            },
          }}
      >
          <Avatar
            sx={{
              m: 1,
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.2)',
              animation: `${float} 3s ease-in-out infinite`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(10deg)',
                boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)',
              },
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
        </Avatar>
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          >
            Create Account
          </Typography>

          {/* Progress indicator */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ mb: 1 }}
            >
              Form Completion: {Math.round(formProgress)}%
        </Typography>
            <Box
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${formProgress}%`,
                  background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                  borderRadius: 2,
                  transition: 'width 0.3s ease-in-out',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: `${shimmer} 2s infinite`,
                  },
                }}
              />
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  animation: 'fadeIn 0.5s ease-out',
                  '& .MuiAlert-icon': {
                    color: 'error.main'
                  }
                }}
              >
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                autoComplete="given-name"
                  error={error?.includes('First Name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    ...getInputProps('firstName')
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                autoComplete="family-name"
                  error={error?.includes('Last Name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    ...getInputProps('lastName')
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    ...getInputProps('username')
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                autoComplete="email"
                type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    ...getInputProps('email')
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                  type={showPassword ? 'text' : 'password'}
                id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                autoComplete="new-password"
                helperText="Password must be at least 6 characters long"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        {validFields.password && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        {validFields.confirmPassword && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
                <FormControl 
                  fullWidth 
                  required
                  error={error?.includes('Role')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                    onChange={handleRoleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        {role === 'student' ? (
                          <SchoolIcon sx={{ color: 'action.active', ml: 1 }} />
                        ) : (
                          <WorkIcon sx={{ color: 'action.active', ml: 1 }} />
                        )}
                      </InputAdornment>
                    }
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Conditional fields based on role */}
            {role === 'student' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="studentId"
                    label="Student ID"
                    name="studentId"
                    autoComplete="off"
                    value={formData.studentId}
                    onChange={handleStudentIdChange}
                    error={error?.includes('Student ID')}
                    helperText={error?.includes('Student ID') ? error : 'Enter 8 digits student ID'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon />
                        </InputAdornment>
                      ),
                      ...getInputProps('studentId'),
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      required
                      error={error?.includes('Academic Year')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                    <InputLabel id="academic-year-label">Academic Year</InputLabel>
                    <Select
                      labelId="academic-year-label"
                      id="academicYear"
                      name="academicYear"
                        value={formData.academicYear}
                        onChange={handleInputChange}
                      label="Academic Year"
                        endAdornment={validFields.academicYear && (
                          <InputAdornment position="end">
                            <CheckCircleIcon color="success" />
                          </InputAdornment>
                        )}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((year) => (
                        <MenuItem key={year} value={year}>
                          Year {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {role === 'teacher' && (
              <Grid item xs={12}>
                  <FormControl 
                    fullWidth 
                    required
                    error={error?.includes('Department')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  >
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    label="Department"
                      endAdornment={validFields.department && (
                        <InputAdornment position="end">
                          <CheckCircleIcon color="success" />
                        </InputAdornment>
                      )}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                  transition: 'transform 0.5s ease-in-out',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Creating Account...</span>
                </Box>
              ) : (
                'Create Account'
              )}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        </Paper>
      </Container>
      </Box>
  );
}

export default Register; 