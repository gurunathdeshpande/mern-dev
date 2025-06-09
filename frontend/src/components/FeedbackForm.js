import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
  Checkbox,
  Alert,
  Snackbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Rating,
  styled,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CS_SUBJECTS, SEMESTERS } from '../utils/constants';
import {
  Star as StarIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Styled components for better UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

const steps = ['Basic Information', 'Feedback Content', 'Additional Details'];

const FeedbackForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    teacher: '',
    subject: '',
    content: '',
    rating: 5,
    semester: '',
    academicYear: '',
    isAnonymous: false,
    status: 'pending',
    teacherResponse: '',
  });
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user.role === 'student') {
        await fetchTeachers();
      }
      if (id) {
        setIsEditing(true);
        await fetchFeedback();
      } else {
        calculateAcademicYear();
      }
    };
    loadData();
  }, [id, user.role]);

  const calculateAcademicYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    let academicYear;
    if (month >= 7) {
      academicYear = `${currentYear}-${currentYear + 1}`;
    } else {
      academicYear = `${currentYear - 1}-${currentYear}`;
    }
    
    setFormData(prev => ({
      ...prev,
      academicYear: prev.academicYear || academicYear
    }));
  };

  const fetchTeachers = async () => {
    try {
      setIsLoadingTeachers(true);
      const response = await axios.get('/api/auth/teachers');
      if (response.data && response.data.data) {
        setTeachers(response.data.data);
      } else {
        setTeachers([]);
        setToast({
          open: true,
          message: 'No teachers found',
          severity: 'warning'
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error fetching teachers',
        severity: 'error'
      });
      setTeachers([]);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`/api/feedback/${id}`);
      if (!response.data.success) {
        throw new Error('Failed to fetch feedback');
      }
      
      const feedback = response.data.data;

      setFormData({
        teacher: feedback.teacher._id,
        subject: feedback.subject,
        content: feedback.content,
        rating: feedback.rating,
        semester: feedback.semester,
        academicYear: feedback.academicYear,
        isAnonymous: feedback.isAnonymous || false,
        status: feedback.status || 'pending',
        teacherResponse: feedback.teacherResponse || '',
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Error fetching feedback',
        severity: 'error'
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.teacher) newErrors.teacher = 'Teacher is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        break;
      case 2:
        if (!formData.content) {
          newErrors.content = 'Feedback content is required';
        } else if (formData.content.length < 10) {
          newErrors.content = 'Feedback must be at least 10 characters long';
        } else if (formData.content.length > 1000) {
          newErrors.content = 'Feedback cannot exceed 1000 characters';
        }
        if (!formData.rating) newErrors.rating = 'Rating is required';
        break;
      case 3:
        if (!formData.semester) {
          newErrors.semester = 'Semester is required';
        } else if (formData.semester < 1 || formData.semester > 8) {
          newErrors.semester = 'Semester must be between 1 and 8';
        }
        if (!formData.academicYear) {
          newErrors.academicYear = 'Academic year is required';
        } else if (!/^\d{4}-\d{4}$/.test(formData.academicYear)) {
          newErrors.academicYear = 'Invalid academic year format. Use YYYY-YYYY';
        } else {
          const [startYear, endYear] = formData.academicYear.split('-').map(Number);
          if (endYear !== startYear + 1) {
            newErrors.academicYear = 'End year must be start year + 1';
          }
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For students, only submit when on the last step and all validations pass
    if (user.role === 'student' && currentStep !== 3) {
      handleNext();
      return;
    }

    // Validate all steps before submitting
    if (user.role === 'student') {
      for (let step = 1; step <= 3; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        let updateData = {};
        if (user.role === 'student') {
          updateData = {
            teacher: formData.teacher,
            subject: formData.subject,
            content: formData.content,
            rating: formData.rating,
            semester: formData.semester,
            academicYear: formData.academicYear,
            isAnonymous: formData.isAnonymous
          };
        } else if (user.role === 'teacher') {
          updateData = {
            status: formData.status,
            teacherResponse: formData.teacherResponse
          };
        }
        
        const response = await axios.put(`/api/feedback/${id}`, updateData);
        if (!response.data.success) {
          throw new Error('Failed to update feedback');
        }
        
        setToast({
          open: true,
          message: 'Feedback updated successfully',
          severity: 'success'
        });
        
        // Navigate back after successful update
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const response = await axios.post('/api/feedback', formData);
        if (!response.data.success) {
          throw new Error('Failed to submit feedback');
        }
        
        setToast({
          open: true,
          message: 'Feedback submitted successfully',
          severity: 'success'
        });
        
        setFormData({
          teacher: '',
          subject: '',
          content: '',
          rating: 5,
          semester: '',
          academicYear: '',
          isAnonymous: false,
          status: 'pending',
          teacherResponse: '',
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Error updating feedback',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'semester' ? parseInt(value, 10) : 
              name === 'rating' ? parseInt(value, 10) : 
              value,
    }));
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  const handleGoBack = () => {
    if (formData.content || formData.rating || formData.subject) {
      // If form has data, show confirmation
      if (window.confirm('Are you sure you want to go back? Your feedback will be lost.')) {
        navigate(-1);
      }
    } else {
      // If form is empty, go back directly
      navigate(-1);
    }
  };

  const renderStepContent = (step) => {
    if (user.role === 'teacher') {
  return (
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="reviewed">Reviewed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>

              <TextField
            fullWidth
            multiline
            rows={4}
                name="teacherResponse"
            label="Your Response"
                value={formData.teacherResponse}
                onChange={handleInputChange}
            placeholder="Provide your feedback or response to the student..."
              />
          </Stack>
      );
    }

    switch (step) {
      case 1:
        return (
              <Stack spacing={3}>
            <FormControl error={!!errors.teacher} fullWidth>
              <InputLabel>Select Teacher</InputLabel>
                  <Select
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                label="Select Teacher"
                disabled={isLoadingTeachers}
                  >
                {isLoadingTeachers ? (
                  <MenuItem disabled>Loading teachers...</MenuItem>
                ) : teachers.length === 0 ? (
                  <MenuItem disabled>No teachers available</MenuItem>
                ) : (
                  teachers.map((teacher) => (
                      <MenuItem key={teacher._id} value={teacher._id}>
                        {`${teacher.firstName} ${teacher.lastName}`}
                      </MenuItem>
                  ))
                )}
                  </Select>
                  {errors.teacher && <FormHelperText>{errors.teacher}</FormHelperText>}
                </FormControl>

            <FormControl error={!!errors.subject} fullWidth>
              <InputLabel>Select Subject</InputLabel>
                  <Select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                label="Select Subject"
                  >
                {CS_SUBJECTS.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subject && <FormHelperText>{errors.subject}</FormHelperText>}
                </FormControl>
              </Stack>
        );

      case 2:
        return (
              <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Rate your experience
              </Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: { name: 'rating', value: newValue }
                  });
                }}
                size="large"
                precision={0.5}
              />
            </Box>

                  <TextField
              fullWidth
              multiline
              rows={6}
                    name="content"
              label="Your Feedback"
                    value={formData.content}
                    onChange={handleInputChange}
                    error={!!errors.content}
                    helperText={errors.content}
              placeholder="Please provide detailed feedback about the teaching, course content, and your learning experience..."
            />

                      <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: 'isAnonymous',
                        type: 'checkbox',
                        checked: e.target.checked
                      }
                    })
                  }
                />
              }
              label="Submit anonymously"
                      />
              </Stack>
        );

      case 3:
        return (
              <Stack spacing={3}>
            <FormControl error={!!errors.semester} fullWidth>
              <InputLabel>Select Semester</InputLabel>
                  <Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                label="Select Semester"
                  >
                {SEMESTERS.map((sem) => (
                  <MenuItem key={sem.value} value={sem.value}>
                    {sem.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.semester && <FormHelperText>{errors.semester}</FormHelperText>}
                </FormControl>

                  <TextField
              fullWidth
                    name="academicYear"
              label="Academic Year"
                    value={formData.academicYear}
              onChange={handleInputChange}
                    error={!!errors.academicYear}
              helperText={errors.academicYear || 'Format: YYYY-YYYY (e.g., 2023-2024)'}
              placeholder="YYYY-YYYY"
                />
              </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
        <Typography variant="h4" component="h1">
          {isEditing ? (
            user.role === 'teacher' ? 'Review Feedback' : 'Edit Feedback'
          ) : (
            'Submit Feedback'
          )}
        </Typography>
      </Box>

      <StyledPaper>
        {user.role === 'student' && (
          <Stepper activeStep={currentStep - 1} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {renderStepContent(currentStep)}

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            {user.role === 'student' && currentStep > 1 && (
              <StyledButton
                onClick={handlePrevious}
                variant="outlined"
                disabled={isSubmitting}
              >
                  Previous
              </StyledButton>
              )}
            <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
              fullWidth={user.role === 'teacher' || currentStep === 3}
                >
              {isSubmitting ? 'Submitting...' : 
               user.role === 'teacher' ? (isEditing ? 'Update Response' : 'Submit Response') :
               currentStep < 3 ? 'Next' :
               isEditing ? 'Update Feedback' : 'Submit Feedback'}
            </StyledButton>
          </Stack>
            </Box>
      </StyledPaper>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FeedbackForm;