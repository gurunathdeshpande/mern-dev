import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const FeedbackStats = ({ feedbacks }) => {
  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = totalFeedbacks > 0
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedbacks).toFixed(1)
    : 0;
  
  const ratingDistribution = Array(5).fill(0);
  feedbacks.forEach(feedback => {
    ratingDistribution[Math.floor(feedback.rating) - 1]++;
  });

  const subjectDistribution = feedbacks.reduce((acc, curr) => {
    acc[curr.subject] = (acc[curr.subject] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Rating',
        data: [4.2, 4.4, 4.1, 4.5, 4.3, averageRating],
        borderColor: '#4F46E5',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(subjectDistribution),
    datasets: [
      {
        label: 'Feedback Count by Subject',
        data: Object.values(subjectDistribution),
        backgroundColor: '#4F46E5',
      },
    ],
  };

  const doughnutChartData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        data: ratingDistribution,
        backgroundColor: [
          '#4F46E5',
          '#7C3AED',
          '#EC4899',
          '#F59E0B',
          '#EF4444',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rating Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feedback by Subject
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barChartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rating Breakdown
            </Typography>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating - 1];
              const percentage = totalFeedbacks > 0
                ? (count / totalFeedbacks * 100).toFixed(1)
                : 0;
              
              return (
                <Box key={rating} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{`${rating} Stars`}</Typography>
                    <Typography>{`${count} (${percentage}%)`}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(percentage)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                      },
                    }}
                  />
                </Box>
              );
            })}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FeedbackStats; 
 