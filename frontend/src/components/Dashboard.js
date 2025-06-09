import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  useTheme,
  Fade,
  Fab,
  Tooltip,
  Zoom,
  Alert,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Assessment,
  Star,
  AccessTime,
  CheckCircle,
  Add as AddIcon,
  TrendingUp,
  People,
  Feedback,
  Timeline,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon, trend, trendValue, gradient }) => (
  <Card
    sx={{
      height: '100%',
      background: gradient,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 100% 0)',
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      {trend && trendValue && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: trend === 'up' ? '#A7F3D0' : '#FCA5A5',
            }}
          >
            {trend === 'up' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
            {trendValue}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
            vs last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const ProgressSection = ({ title, value, total, color, icon: Icon }) => {
  const percentage = (value / total) * 100;
  return (
    <Box 
      sx={{ 
        mb: 3,
        p: 2,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(5px)',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
          boxShadow: `0 4px 20px ${color}15`
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: `${color}15`,
              color: color,
              border: `2px solid ${color}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(360deg)',
                bgcolor: color,
                color: 'white'
              }
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="body1" color="text.primary" fontWeight="600">
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: `${color}90` }}>
              {percentage.toFixed(1)}% Complete
            </Typography>
          </Box>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: '700',
            color: color,
            textShadow: `0 2px 4px ${color}30`
          }}
        >
          {value}/{total}
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: `${color}15`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
              borderRadius: 6,
              backgroundImage: `linear-gradient(90deg, ${color}CC, ${color})`,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 2s infinite',
              borderRadius: 6,
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }}
        />
      </Box>
    </Box>
  );
};

function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    pendingFeedbacks: 0,
    reviewedFeedbacks: 0,
    totalUsers: 0,
    responseRate: 0,
    monthlyStats: {
      feedbackGrowth: 0,
      userGrowth: 0,
      ratingGrowth: 0,
      responseRateGrowth: 0
    },
    recentActivities: []
  });
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard statistics
      const response = await axios.get('/api/feedback/dashboard-stats');
      
      if (response.data && response.data.success) {
        const { data } = response.data;
        setStats({
          totalFeedbacks: data.totalFeedbacks || 0,
          averageRating: parseFloat(data.averageRating) || 0,
          pendingFeedbacks: data.pendingFeedbacks || 0,
          reviewedFeedbacks: data.reviewedFeedbacks || 0,
          totalUsers: data.totalUsers || 0,
          responseRate: data.responseRate || 0,
          monthlyStats: {
            feedbackGrowth: data.monthlyStats?.feedbackGrowth || 0,
            userGrowth: data.monthlyStats?.userGrowth || 0,
            ratingGrowth: data.monthlyStats?.ratingGrowth || 0,
            responseRateGrowth: data.monthlyStats?.responseRateGrowth || 0
          },
          recentActivities: data.recentActivities || []
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
      setStats({
        totalFeedbacks: 0,
        averageRating: 0,
        pendingFeedbacks: 0,
        reviewedFeedbacks: 0,
        totalUsers: 0,
        responseRate: 0,
        monthlyStats: {
          feedbackGrowth: 0,
          userGrowth: 0,
          ratingGrowth: 0,
          responseRateGrowth: 0
        },
        recentActivities: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8faff 0%, #f0f7ff 100%)',
        marginTop: '64px',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.username}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your feedback system today.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error loading statistics: {error}
          </Alert>
        )}

        <Fade in timeout={800}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Feedback"
                value={stats.totalFeedbacks}
                icon={<Feedback />}
                trend={stats.monthlyStats.feedbackGrowth >= 0 ? "up" : "down"}
                trendValue={`${Math.abs(stats.monthlyStats.feedbackGrowth)}%`}
                gradient={theme => theme.palette.gradients.primary}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Users"
                value={stats.totalUsers}
                icon={<People />}
                trend={stats.monthlyStats.userGrowth >= 0 ? "up" : "down"}
                trendValue={`${Math.abs(stats.monthlyStats.userGrowth)}%`}
                gradient={theme => theme.palette.gradients.success}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg. Rating"
                value={stats.averageRating.toFixed(1)}
                icon={<Star />}
                trend={stats.monthlyStats.ratingGrowth >= 0 ? "up" : "down"}
                trendValue={`${Math.abs(stats.monthlyStats.ratingGrowth)}%`}
                gradient={theme => theme.palette.gradients.warning}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Response Rate"
                value={`${stats.responseRate}%`}
                icon={<Timeline />}
                trend={stats.monthlyStats.responseRateGrowth >= 0 ? "up" : "down"}
                trendValue={`${Math.abs(stats.monthlyStats.responseRateGrowth)}%`}
                gradient={theme => theme.palette.gradients.info}
              />
            </Grid>

            {/* Progress Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}15`,
                  border: theme => `1px solid ${theme.palette.primary.main}20`,
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme => `0 12px 48px ${theme.palette.primary.main}30`,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: theme => `2px dashed ${theme.palette.primary.main}20`
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                      border: theme => `1px solid ${theme.palette.primary.main}20`,
                      mr: 2
                    }}
                  >
                    <Assessment sx={{ color: 'primary.main', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      Feedback Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Track your feedback submission status
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <ProgressSection
                    title="Submitted Feedback"
                    value={stats.totalFeedbacks}
                    total={stats.totalFeedbacks}
                    color="#4F46E5"
                    icon={Assessment}
                  />
                  <ProgressSection
                    title="Pending Reviews"
                    value={stats.pendingFeedbacks}
                    total={stats.totalFeedbacks}
                    color="#EC4899"
                    icon={AccessTime}
                  />
                  <ProgressSection
                    title="Completed Reviews"
                    value={stats.reviewedFeedbacks}
                    total={stats.totalFeedbacks}
                    color="#10B981"
                    icon={CheckCircle}
                  />
                </Box>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}15`,
                  border: theme => `1px solid ${theme.palette.primary.main}20`,
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme => `0 12px 48px ${theme.palette.primary.main}30`,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: theme => `2px dashed ${theme.palette.primary.main}20`
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                      border: theme => `1px solid ${theme.palette.primary.main}20`,
                      mr: 2
                    }}
                  >
                    <Timeline sx={{ color: 'primary.main', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Latest updates and submissions
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {stats.recentActivities.length === 0 ? (
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: 6,
                        px: 3,
                        color: 'text.secondary',
                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.primary.main}02 100%)`,
                        borderRadius: 3,
                        border: theme => `1px dashed ${theme.palette.primary.main}20`
                      }}
                    >
                      <Assessment sx={{ fontSize: 64, color: 'primary.main', opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                        No Recent Activities
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        New activities will appear here as they happen
                      </Typography>
                    </Box>
                  ) : (
                    stats.recentActivities.map((activity, index) => (
                      <Box key={activity.id || index}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            py: 2,
                            px: 2,
                            borderRadius: 2,
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, transparent 100%)`,
                              transform: 'translateX(5px)',
                              '& .MuiAvatar-root': {
                                transform: 'scale(1.1) rotate(10deg)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                              }
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 45,
                              height: 45,
                              transition: 'all 0.3s ease',
                              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                              border: '2px solid white',
                              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)',
                            }}
                          >
                            <Assessment />
                          </Avatar>
                          <Box sx={{ ml: 2, flex: 1 }}>
                            <Typography variant="body1" fontWeight="600" color="text.primary">
                              {activity.description}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block',
                                color: 'text.secondary',
                                mt: 0.5
                              }}
                            >
                              {new Date(activity.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                          {activity.status && (
                            <Chip
                              label={activity.status}
                              size="small"
                              sx={{
                                ml: 2,
                                px: 1,
                                height: 28,
                                bgcolor: (theme) => 
                                  activity.status === 'pending' 
                                    ? `${theme.palette.warning.main}15`
                                    : activity.status === 'reviewed'
                                    ? `${theme.palette.success.main}15`
                                    : `${theme.palette.info.main}15`,
                                color: (theme) =>
                                  activity.status === 'pending'
                                    ? theme.palette.warning.main
                                    : activity.status === 'reviewed'
                                    ? theme.palette.success.main
                                    : theme.palette.info.main,
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: (theme) =>
                                  activity.status === 'pending'
                                    ? `${theme.palette.warning.main}30`
                                    : activity.status === 'reviewed'
                                    ? `${theme.palette.success.main}30`
                                    : `${theme.palette.info.main}30`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px) scale(1.05)',
                                  boxShadow: (theme) =>
                                    activity.status === 'pending'
                                      ? `0 4px 12px ${theme.palette.warning.main}20`
                                      : activity.status === 'reviewed'
                                      ? `0 4px 12px ${theme.palette.success.main}20`
                                      : `0 4px 12px ${theme.palette.info.main}20`,
                                }
                              }}
                            />
                          )}
                        </Box>
                        {index < stats.recentActivities.length - 1 && (
                          <Divider 
                            sx={{ 
                              my: 1,
                              borderColor: theme => `${theme.palette.primary.main}10`,
                              borderStyle: 'dashed'
                            }} 
                          />
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      </Container>

      <Zoom in={true} style={{ transitionDelay: '500ms' }}>
        <Tooltip title="Submit New Feedback" placement="left">
          <Fab
            color="primary"
            aria-label="add feedback"
            onClick={() => navigate('/feedback/new')}
            sx={{ 
              position: 'fixed',
              bottom: 32,
              right: 32,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
}

export default Dashboard; 