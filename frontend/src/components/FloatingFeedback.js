import React, { useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Rating,
  Slide,
  Fade,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const FloatingFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();

  // Hide the widget on the feedback form page
  if (location.pathname === '/feedback/new') {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to a backend
    console.log('Feedback:', { message, rating });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setRating(5);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 40 }, // Increased bottom margin
          left: { xs: 20, sm: 40 }, // Moved to left side
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 20%, #7C3AED 80%)',
            },
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Box>

      {/* Feedback Form */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: { xs: 140, sm: 100 }, // Increased bottom margin
            left: { xs: 20, sm: 40 }, // Moved to left side
            width: 320,
            maxWidth: '90vw',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">Quick Feedback</Typography>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {submitted ? (
              <Fade in={submitted}>
                <Box
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    color: 'success.main',
                  }}
                >
                  <Typography variant="h6">Thank you!</Typography>
                  <Typography variant="body2">
                    Your feedback has been submitted.
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography component="legend" gutterBottom>
                    Rate your experience
                  </Typography>
                  <Rating
                    value={rating}
                    onChange={(e, newValue) => setRating(newValue)}
                    size="large"
                  />
                </Box>

                <TextField
                  multiline
                  rows={3}
                  placeholder="Share your thoughts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  variant="outlined"
                  fullWidth
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F46E5 20%, #7C3AED 80%)',
                    },
                  }}
                >
                  Send Feedback
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default FloatingFeedback; 
 