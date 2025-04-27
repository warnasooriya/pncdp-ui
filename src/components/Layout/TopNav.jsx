import React from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';

const TopNav = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#283593' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ProNetWork
        </Typography>
        <Box sx={{ position: 'relative', mr: 2 }}>
          <InputBase
            placeholder="Search…"
            sx={{ 
              backgroundColor: 'white',
              pl: 2,
              pr: 2,
              borderRadius: 1,
              height: '36px'
            }}
          />
          <IconButton sx={{ position: 'absolute', right: 0, top: 0 }}>
            <SearchIcon sx={{ color: '#283593' }} />
          </IconButton>
        </Box>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
          <MessageIcon />
        </IconButton>
        <Avatar sx={{ ml: 2 }} alt="Profile" src="" />
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
