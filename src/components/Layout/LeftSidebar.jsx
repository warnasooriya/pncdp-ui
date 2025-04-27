import React from 'react';
import { Box, Card, Stack, Typography, Button, Avatar, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {

  const navigate = useNavigate();

    const linkktoprofile = () => {
      console.log('clicked');
         navigate('/profile');
    }

  return (
    <Box sx={{ width: '20%', display: { xs: 'none', md: 'block' } }}>
      <Stack spacing={2}>

        {/* My Profile Card */}
        <Card variant="outlined" sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <Avatar 
            sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }} 
            src="" 
            alt="Profile"
          />
          <Typography variant="subtitle1" fontWeight="bold">
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Software Engineer
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ textTransform: 'none', backgroundColor: '#283593', borderRadius: 5 }}
            onClick={() => {linkktoprofile()}}
          >
            View Profile
        
          </Button>
        </Card>

        {/* Quick Links Card */}
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Quick Access
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GroupIcon sx={{ color: '#283593' }} />
              </ListItemIcon>
              <ListItemText primary="My Network" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <WorkIcon sx={{ color: '#283593' }} />
              </ListItemIcon>
              <ListItemText primary="Jobs" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <ChatIcon sx={{ color: '#283593' }} />
              </ListItemIcon>
              <ListItemText primary="Messaging" />
            </ListItemButton>
          </List>
        </Card>

      </Stack>
    </Box>
  );
};

export default LeftSidebar;
