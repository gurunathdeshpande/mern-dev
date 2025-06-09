import React, { useState, useEffect } from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  IconButton,
  Badge,
  Divider,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Feedback,
  Star,
  Comment,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  // Simulated notifications - in real app, these would come from backend
  useEffect(() => {
    const demoNotifications = [
      {
        id: 1,
        type: 'feedback',
        title: 'New Feedback Received',
        message: 'A student has submitted new feedback for your course',
        time: '5 minutes ago',
        read: false,
        icon: <Feedback sx={{ color: '#4F46E5' }} />,
      },
      {
        id: 2,
        type: 'review',
        title: 'Feedback Reviewed',
        message: 'Your feedback has been reviewed by the teacher',
        time: '1 hour ago',
        read: false,
        icon: <Star sx={{ color: '#F59E0B' }} />,
      },
      {
        id: 3,
        type: 'comment',
        title: 'New Comment',
        message: 'A teacher has commented on your feedback',
        time: '2 hours ago',
        read: true,
        icon: <Comment sx={{ color: '#10B981' }} />,
      },
      {
        id: 4,
        type: 'status',
        title: 'Status Update',
        message: 'Your feedback status has been updated to "Reviewed"',
        time: '1 day ago',
        read: true,
        icon: <CheckCircle sx={{ color: '#EC4899' }} />,
      },
    ];

    setNotifications(demoNotifications);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: '#4F46E5',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={markAllAsRead}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    },
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      }}
                    >
                      {notification.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification.read ? 400 : 600,
                          color: notification.read ? 'text.primary' : '#4F46E5',
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ mb: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationCenter; 
 