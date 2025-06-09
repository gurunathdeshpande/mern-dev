import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Chip,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  ListItemSecondaryAction,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Feedback,
  Person,
  Settings,
  Notifications,
  ExitToApp,
  School,
  Assessment,
  RateReview,
  AccountCircle,
  Star,
  TrendingUp,
  Assignment,
  People,
  NotificationsActive,
  NotificationsOff,
  Email as EmailIcon,
  AccessTime,
  ChevronRight,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    newFeedback: true,
    feedbackReminders: true,
    emailNotifications: true,
    instantNotifications: true,
  });
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [showMessage, setShowMessage] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = () => {
      const mockNotifications = [
        {
          id: 1,
          type: 'feedback',
          message: 'New feedback received from Professor Smith',
          time: '2 hours ago',
          read: false,
        },
        {
          id: 2,
          type: 'reminder',
          message: 'Reminder: Pending feedback for CS101',
          time: '1 day ago',
          read: false,
        },
        {
          id: 3,
          type: 'system',
          message: 'Your profile was successfully updated',
          time: '2 days ago',
          read: true,
        },
      ];
      setNotifications(mockNotifications);
      setNotificationCount(mockNotifications.filter(n => !n.read).length);
    };

    fetchNotifications();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const handleSettingsOpen = () => {
    setShowSettings(true);
    handleProfileMenuClose();
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleSettingChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    setMessage({
      text: 'Notification settings updated successfully!',
      type: 'success',
    });
    setShowMessage(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewProfile = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
    },
    ...(user?.role === 'teacher' ? [{
      text: 'Analytics',
      icon: <Assessment />,
      path: '/analytics',
    }] : []),
    {
      text: 'Feedback',
      icon: <RateReview />,
      path: '/feedback',
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.default' }}>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '1.5rem',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user?.username}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<Star sx={{ fontSize: '1rem' }} />}
              label="4.8 Rating"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
            <Chip
              icon={<TrendingUp sx={{ fontSize: '1rem' }} />}
              label="Active"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2, px: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          MAIN MENU
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={isActive(item.path)}
              sx={{
                mb: 1,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: 'transparent',
                  transition: 'all 0.2s',
                },
                '&:hover': {
                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                  '&::before': {
                    bgcolor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                  },
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    fontWeight: 600,
                  },
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive(item.path) ? 'white' : 'text.secondary',
                  minWidth: 40,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: '0.95rem',
                }}
              />
              {isActive(item.path) && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    mr: 1,
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: 'text.secondary',
            fontWeight: 600,
            mt: 4,
            display: 'block',
          }}
        >
          QUICK LINKS
        </Typography>
        <List>
          <ListItem
            button
            onClick={() => navigate('/profile')}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(79, 70, 229, 0.08)',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <Person />
            </ListItemIcon>
            <ListItemText 
              primary="View Profile"
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
            />
          </ListItem>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.08)',
                '& .MuiListItemIcon-root': {
                  color: 'error.main',
                },
                '& .MuiListItemText-primary': {
                  color: 'error.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              color: 'primary.main',
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications" arrow>
              <IconButton
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account settings" arrow>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                sx={{
                  ml: 1,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 35,
                    height: 35,
                    border: '2px solid rgba(79, 70, 229, 0.1)',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                borderRadius: 2,
                minWidth: 200,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  mx: 0.5,
                  mb: 0.2,
                  '&:hover': {
                    bgcolor: 'rgba(79, 70, 229, 0.08)',
                  },
                },
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 2,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Welcome back,
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user?.username}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleViewProfile}>
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <Typography variant="body2">View Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleSettingsOpen}>
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <Typography variant="body2" color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Toolbar />

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" fontWeight="medium">
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationRead(notification.id)}
              sx={{
                py: 2,
                px: 2,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                bgcolor: notification.read ? 'transparent' : 'action.hover',
              }}
            >
              <ListItemIcon>
                {notification.type === 'feedback' ? (
                  <Assignment color="primary" />
                ) : notification.type === 'reminder' ? (
                  <AccessTime color="warning" />
                ) : (
                  <NotificationsActive color="success" />
                )}
              </ListItemIcon>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      <Dialog
        open={showSettings}
        onClose={handleSettingsClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Notification Settings
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText
                primary="New Feedback Notifications"
                secondary="Get notified when you receive new feedback"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.newFeedback}
                  onChange={() => handleSettingChange('newFeedback')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTime />
              </ListItemIcon>
              <ListItemText
                primary="Feedback Reminders"
                secondary="Receive reminders for pending feedback"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.feedbackReminders}
                  onChange={() => handleSettingChange('feedbackReminders')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive notifications via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleSettingChange('emailNotifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsActive />
              </ListItemIcon>
              <ListItemText
                primary="Instant Notifications"
                secondary="Receive real-time notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.instantNotifications}
                  onChange={() => handleSettingChange('instantNotifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>Close</Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default Navigation; 
 