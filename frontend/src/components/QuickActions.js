import React from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  RateReview,
  Assessment,
  FilterList,
  Sort,
  GetApp,
  Share,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Only show relevant actions based on user role
  const actions = [
    ...(user?.role === 'student' ? [
      {
        icon: <AddIcon />,
        name: 'New Feedback',
        action: () => navigate('/feedback/new'),
        tooltip: 'Create new feedback',
      }
    ] : []),
    {
      icon: <RateReview />,
      name: 'Review Pending',
      action: () => navigate('/?status=pending'),
      tooltip: 'View pending feedback',
    },
    ...(user?.role === 'teacher' ? [{
      icon: <Assessment />,
      name: 'Analytics',
      action: () => navigate('/analytics'),
      tooltip: 'View analytics',
    }] : []),
    {
      icon: <FilterList />,
      name: 'Filter',
      action: () => {/* Filter functionality */},
      tooltip: 'Filter feedback',
    },
    {
      icon: <Sort />,
      name: 'Sort',
      action: () => {/* Sort functionality */},
      tooltip: 'Sort feedback',
    },
    {
      icon: <GetApp />,
      name: 'Export',
      action: () => {/* Export functionality */},
      tooltip: 'Export feedback data',
    },
    {
      icon: <Share />,
      name: 'Share',
      action: () => {/* Share functionality */},
      tooltip: 'Share feedback',
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Quick Actions"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        '& .MuiFab-primary': {
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
          },
        },
      }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.tooltip}
          onClick={action.action}
          FabProps={{
            sx: {
              bgcolor: 'white',
              '&:hover': {
                bgcolor: 'rgba(79, 70, 229, 0.1)',
              },
            },
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default QuickActions; 
 