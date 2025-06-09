import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Grid,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person,
  Email,
  School,
  Edit as EditIcon,
  PhotoCamera,
  Work,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || '',
    department: user?.department || 'Computer Science',
    designation: user?.role === 'teacher' ? 'Professor' : 'Student',
  });

  const handleGoBack = () => {
    if (isEditing) {
      // If in edit mode, show confirmation
      if (window.confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        navigate(-1);
      }
    } else {
      // If not in edit mode, go back directly
      navigate(-1);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      username: user?.username || '',
      email: user?.email || '',
      role: user?.role || '',
      department: user?.department || 'Computer Science',
      designation: user?.role === 'teacher' ? 'Professor' : 'Student',
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        username: formData.username,
        email: formData.email,
        department: formData.department
      };

      // Update user profile using context
      await updateUser(updateData);

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setShowMessage(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error.message || 'Failed to update profile', 
        type: 'error' 
      });
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={handleGoBack}
          sx={{ 
            mr: 2,
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(79, 70, 229, 0.08)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Profile Settings
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            position: 'relative',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Profile
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2.5rem',
                  border: '4px solid rgba(255,255,255,0.3)',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  border: '2px solid white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <PhotoCamera sx={{ fontSize: 20, color: 'white' }} />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user?.username}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  opacity: 0.9,
                }}
              >
                <Work sx={{ fontSize: 20 }} />
                {formData.designation} • {formData.department}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            {!isEditing && (
              <Button
                variant="contained"
                onClick={handleEdit}
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 20%, #7C3AED 80%)',
                  },
                }}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                    Personal Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Username
                        </Typography>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{formData.username}</Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Email
                        </Typography>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{formData.email}</Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Role
                        </Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {capitalizeFirstLetter(formData.role)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Department
                        </Typography>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body1">{formData.department}</Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          {isEditing && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 20%, #7C3AED 80%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity={message.type}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 
 