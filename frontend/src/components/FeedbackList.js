import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Fade,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Search,
  Edit,
  Delete,
  Person,
  School,
  AccessTime,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FeedbackList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    // Filter feedbacks based on search term
    const filtered = feedbacks.filter((feedback) => {
      const searchString = searchTerm.toLowerCase();
      return (
        feedback.subject?.toLowerCase().includes(searchString) ||
        feedback.content?.toLowerCase().includes(searchString) ||
        feedback.student?.username?.toLowerCase().includes(searchString) ||
        feedback.teacher?.username?.toLowerCase().includes(searchString)
      );
    });
    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/feedback');
      setFeedbacks(response.data.data || []);
      setFilteredFeedbacks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, feedback) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeedback(feedback);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFeedback(null);
  };

  const handleEdit = () => {
    if (!selectedFeedback || !selectedFeedback._id) {
      setToast({
        open: true,
        message: 'No feedback selected for editing',
        severity: 'error'
      });
      return;
    }

    // Check if feedback is editable (for students)
    if (user.role === 'student') {
      const feedbackAge = Math.floor((Date.now() - new Date(selectedFeedback.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      if (feedbackAge > 7) {
        setToast({
          open: true,
          message: 'Feedback can only be edited within 7 days of creation',
          severity: 'error'
        });
        return;
      }
      if (selectedFeedback.status !== 'pending') {
        setToast({
          open: true,
          message: 'Only pending feedback can be edited',
          severity: 'error'
        });
        return;
      }
    }

    handleMenuClose();
    navigate(`/feedback/edit/${selectedFeedback._id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/feedback/${selectedFeedback._id}`);
      setFeedbacks(feedbacks.filter(f => f._id !== selectedFeedback._id));
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: theme.palette.success.main + '20',
          color: theme.palette.success.main,
        };
      case 'pending':
        return {
          bg: theme.palette.warning.main + '20',
          color: theme.palette.warning.main,
        };
      default:
        return {
          bg: theme.palette.grey[500] + '20',
          color: theme.palette.grey[500],
        };
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Feedback List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all feedback submissions
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search feedback by subject, content, student or teacher..."
          variant="outlined"
          fullWidth
          size="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredFeedbacks.length === 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                backgroundColor: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No feedback found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <Grid item xs={12} key={feedback._id}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Person />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {feedback.subject}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {feedback.content}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Chip
                              icon={<Star sx={{ color: theme.palette.warning.main }} />}
                              label={`${feedback.rating}/5`}
                              size="small"
                              sx={{
                                bgcolor: theme.palette.warning.main + '20',
                                color: theme.palette.warning.main,
                                fontWeight: 'medium',
                              }}
                            />
                            <Chip
                              label={feedback.status}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(feedback.status).bg,
                                color: getStatusColor(feedback.status).color,
                                fontWeight: 'medium',
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              By {feedback.student?.username || 'Anonymous'} • {new Date(feedback.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, feedback)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={Math.ceil(filteredFeedbacks.length / 10)} 
          color="primary"
          onChange={(e, page) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default FeedbackList; 