import React    from 'react';
import { Box, Card, Stack, Typography, Button, Avatar, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';

const LeftSidebar = () => {
   const profile = useSelector(state => state.profileReducer.profile);
  const navigate = useNavigate();

  const linkToProfile = () => {
    navigate('/profile');
  };

 

  return (
    <Box sx={{ width: '20%', display: { xs: 'none', md: 'block' } }}>
      <Stack spacing={2}>
        
        {/* Profile Card */}
        <Card variant="outlined" sx={{ overflow: 'hidden', borderRadius: 3, textAlign: 'center' }}>
          <Box sx={{ height: 80, background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)' }} />
          <Box sx={{ mt: -5 }}>
            <Avatar
              sx={{ width: 80, height: 80, mx: 'auto', border: '3px solid white' }}
              src={profile?.profileImage || 'https://via.placeholder.com/80'}
              alt="Profile"
            />
            <Typography variant="subtitle1" fontWeight="bold" mt={1}>
              {profile?.fullName }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.headline }
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                mt: 2,
                mb: 2,
                borderRadius: '20px',
                backgroundColor: '#1976d2',
                px: 4
              }}
              onClick={linkToProfile}
            >
              Edit profile
            </Button>
          </Box>
        </Card>

        {/* Quick Access Card */}
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <List disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GroupIcon sx={{ color: '#5e5e5e' }} />
              </ListItemIcon>
              <ListItemText primary="My Network"  />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <WorkIcon sx={{ color: '#5e5e5e' }} />
              </ListItemIcon>
              <ListItemText primary="Jobs" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <ChatBubbleOutlineIcon sx={{ color: '#5e5e5e' }} />
              </ListItemIcon>
              <ListItemText primary="Messaging" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <NotificationsNoneIcon sx={{ color: '#5e5e5e' }} />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </List>
        </Card>

        {/* Insights Card */}
        <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Who's viewed your profile
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                54
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Views of your post
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                124
              </Typography>
            </Box>
          </Stack>
        </Card>

      </Stack>
    </Box>
  );
};

export default LeftSidebar;
