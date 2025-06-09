import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    ratingDistribution: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    },
    ratingTrends: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/feedback/analytics?timeRange=${timeRange}`);
      if (response.data && response.data.success) {
        // Ensure rating distribution has all keys
        const ratingDist = {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0,
          ...response.data.data.ratingDistribution
        };
        
        setAnalyticsData({
          ratingDistribution: ratingDist,
          ratingTrends: response.data.data.ratingTrends || []
        });
      } else {
        throw new Error('Invalid response format');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      // Set default data on error
      setAnalyticsData({
        ratingDistribution: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0
        },
        ratingTrends: []
      });
    } finally {
      setLoading(false);
    }
  };

  const prepareDoughnutData = () => ({
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: [
        analyticsData.ratingDistribution['5'] || 0,
        analyticsData.ratingDistribution['4'] || 0,
        analyticsData.ratingDistribution['3'] || 0,
        analyticsData.ratingDistribution['2'] || 0,
        analyticsData.ratingDistribution['1'] || 0,
      ],
      backgroundColor: [
        theme.palette.success.main,
        theme.palette.primary.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.error.main,
      ],
      borderWidth: 0,
    }],
  });

  const prepareLineData = () => {
    // If no trends data, return empty chart data
    if (!analyticsData.ratingTrends || analyticsData.ratingTrends.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Average Rating',
          data: [],
          borderColor: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }]
      };
    }

    return {
      labels: analyticsData.ratingTrends.map(item => 
        new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [{
        label: 'Average Rating',
        data: analyticsData.ratingTrends.map(item => item.averageRating),
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 },
          color: theme.palette.text.secondary,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 12 },
          color: theme.palette.text.secondary,
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
          color: theme.palette.text.secondary,
          callback: function(value) {
            return value.toFixed(1);
          }
        },
        min: 1,
        max: 5,
        stepSize: 1,
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '70%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
        Feedback Analytics
      </Typography>
          <Typography variant="body1" color="text.secondary">
            Key insights from your feedback data
              </Typography>
        </Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
            size="small"
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="year">Last 12 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              p: 3, 
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Rating Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Overview of feedback ratings breakdown
            </Typography>
            <Box sx={{ height: 400, mt: 2 }}>
              <Doughnut data={prepareDoughnutData()} options={doughnutOptions} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              p: 3, 
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Rating Trends
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              How average ratings change over time
            </Typography>
            <Box sx={{ height: 400, mt: 2 }}>
              <Line data={prepareLineData()} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics; 
 