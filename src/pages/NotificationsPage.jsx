import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  PersonAdd,
  Work,
  ThumbUp,
  Comment,
  Share,
  MoreVert,
  CheckCircle,
  Delete
} from '@mui/icons-material';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
import RightSidebar from '../components/Layout/RightSidebar';

const NotificationsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'connection',
      title: 'New Connection Request',
      message: 'John Doe wants to connect with you',
      avatar: '/api/placeholder/40/40',
      timestamp: '2 hours ago',
      read: false,
      category: 'all'
    },
    {
      id: 2,
      type: 'job',
      title: 'Job Application Update',
      message: 'Your application for Senior Developer at TechCorp has been reviewed',
      avatar: '/api/placeholder/40/40',
      timestamp: '4 hours ago',
      read: false,
      category: 'jobs'
    },
    {
      id: 3,
      type: 'like',
      title: 'Post Interaction',
      message: 'Sarah Wilson and 5 others liked your post about React development',
      avatar: '/api/placeholder/40/40',
      timestamp: '1 day ago',
      read: true,
      category: 'all'
    },
    {
      id: 4,
      type: 'comment',
      title: 'New Comment',
      message: 'Mike Johnson commented on your post: "Great insights on modern web development!"',
      avatar: '/api/placeholder/40/40',
      timestamp: '2 days ago',
      read: true,
      category: 'all'
    },
    {
      id: 5,
      type: 'connection',
      title: 'Connection Accepted',
      message: 'Emma Davis accepted your connection request',
      avatar: '/api/placeholder/40/40',
      timestamp: '3 days ago',
      read: false,
      category: 'connections'
    },
    {
      id: 6,
      type: 'job',
      title: 'New Job Recommendation',
      message: 'Frontend Developer position at StartupXYZ matches your profile',
      avatar: '/api/placeholder/40/40',
      timestamp: '1 week ago',
      read: true,
      category: 'jobs'
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'connection':
        return <PersonAdd color="primary" />;
      case 'job':
        return <Work color="success" />;
      case 'like':
        return <ThumbUp color="error" />;
      case 'comment':
        return <Comment color="info" />;
      case 'share':
        return <Share color="warning" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(n => !n.read);
      case 2: // Connections
        return notifications.filter(n => n.type === 'connection');
      case 3: // Jobs
        return notifications.filter(n => n.type === 'job');
      default:
        return notifications;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
    setMenuAnchor(null);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />
        
        <Box sx={{ flex: 1 }}>
          <Card sx={{ minHeight: 'calc(100vh - 120px)' }}>
            <CardContent>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h5">
                    Notifications
                  </Typography>
                  {unreadCount > 0 && (
                    <Badge badgeContent={unreadCount} color="error" />
                  )}
                </Stack>
                
                {unreadCount > 0 && (
                  <Chip
                    label="Mark all as read"
                    variant="outlined"
                    onClick={markAllAsRead}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
              </Box>

              {/* Tabs */}
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="All" />
                <Tab 
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span>Unread</span>
                      {unreadCount > 0 && (
                        <Chip size="small" label={unreadCount} color="error" />
                      )}
                    </Stack>
                  } 
                />
                <Tab label="Connections" />
                <Tab label="Jobs" />
              </Tabs>

              {/* Notifications List */}
              <List sx={{ p: 0 }}>
                {getFilteredNotifications().length === 0 ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      color: 'text.secondary'
                    }}
                  >
                    <NotificationsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      No notifications found
                    </Typography>
                    <Typography variant="body2">
                      {selectedTab === 1 ? 'All caught up! No unread notifications.' : 'You have no notifications in this category.'}
                    </Typography>
                  </Box>
                ) : (
                  getFilteredNotifications().map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          bgcolor: notification.read ? 'transparent' : 'action.hover',
                          borderRadius: 1,
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: notification.read ? 'normal' : 'bold'
                                }}
                              >
                                {notification.title}
                              </Typography>
                              {!notification.read && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main'
                                  }}
                                />
                              )}
                            </Stack>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {notification.timestamp}
                              </Typography>
                            </Box>
                          }
                        />
                        
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAnchor(e.currentTarget);
                            setSelectedNotification(notification.id);
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </ListItem>
                      
                      {index < getFilteredNotifications().length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
        
        <RightSidebar />
      </Box>

      {/* Notification Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (selectedNotification) {
              markAsRead(selectedNotification);
            }
            setMenuAnchor(null);
          }}
        >
          <CheckCircle sx={{ mr: 1 }} />
          Mark as read
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedNotification) {
              deleteNotification(selectedNotification);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NotificationsPage;