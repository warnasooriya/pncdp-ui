/* eslint-disable no-unused-vars */
import React, { use, useState ,useEffect,useMemo} from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar, Badge, Menu, MenuItem, Stack, ListItemIcon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { Link as RouterLink } from 'react-router-dom'; // Assuming you're using react-router
import { useAuthenticator } from "@aws-amplify/ui-react";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useSelector } from 'react-redux';

const TopNav = () => {
    const { signOut, user } = useAuthenticator(); 
  const [anchorEl, setAnchorEl] = useState(null);

  
  const profile = useSelector(state => state.profileReducer.profile);
  const userType = useSelector(state => state.profileReducer.userType);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const topMenuLinks = useMemo(() => {
  const baseLinks  =[
    { icon: HomeIcon, label: 'Home', link: '/' },
    { icon: GroupIcon, label: 'Network' , link: '/mynetwork'},
    { icon: WorkIcon, label: 'Jobs' , link: '/jobs'},
 
  ];
 
    if (userType === 'Recruiter') {
      baseLinks.push({ icon: AutoFixHighIcon , label: 'Job Applications', link: '/applications' });
    }

     baseLinks.push({ icon: MessageIcon, label: 'Messaging', badge: 2, link: '/messages' });
      baseLinks.push({ icon: NotificationsIcon, label: 'Notifications', badge: 5, link: '/notifications' });

    return baseLinks;
  }, [userType]);

 

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    signOut();
    localStorage.clear();
    console.log('Logout clicked');
    setAnchorEl(null);
    window.location.href = '/';
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
          
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {/* Left Side - Logo */}
        <Box style={{cursor: 'pointer'}}x sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'left' }} onClick={() => window.location.href = '/'}>

         <img src="/logo.png" alt="Logo" style={{ height: '70px',   }} /> 
        <Typography variant="h7" style={{paddingTop: '25px'}}    sx={{ color: '#000', fontWeight: 'bold',   fontSize: { xs: '1rem', md: '1.15rem' } }}>
        NextGenCareerHub
        </Typography>
          </Box>


        {/* Center - Search Bar */}
        <Box sx={{ 
          flexGrow: 1, 
          maxWidth: { xs: 200, sm: 300, md: 400 }, 
          mx: 2, 
          my: { xs: 1, md: 0 }, 
          backgroundColor: '#f0f2f5', 
          borderRadius: 2, 
          display: 'flex', 
          alignItems: 'center', 
          px: 2 
        }}>
          <SearchIcon sx={{ color: 'gray' }} />
          <InputBase placeholder="Search" sx={{ ml: 1, flex: 1, fontSize: { xs: '0.8rem', md: '1rem' } }} />
        </Box>

        {/* Center - Icon Navigation */}
        <Stack direction="row" spacing={{ xs: 2, md: 4 }} alignItems="center" flexWrap="wrap">

     
  {topMenuLinks.map(({ icon: Icon, label, badge, link }, index) => (
    <Box
      key={index}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#5e5e5e', minWidth: 20 }}
    >
      {link ? (
        <IconButton component={RouterLink} to={link} style={{ padding: 0 }}>
          {badge ? (
            <Badge badgeContent={badge} color="error">
              <Icon sx={{ color: '#5e5e5e', fontSize: { xs: 20, md: 24 }, mt: -0.5 }} />
            </Badge>
          ) : (
            <Icon sx={{ color: '#5e5e5e', fontSize: { xs: 20, md: 24 } }} />
          )}
        </IconButton>
      ) : (
        <IconButton style={{ padding: 0 }}>
          {badge ? (
            <Badge badgeContent={badge} color="error">
              <Icon sx={{ color: '#5e5e5e', fontSize: { xs: 20, md: 24 }, mt: -0.5 }} />
            </Badge>
          ) : (
            <Icon sx={{ color: '#5e5e5e', fontSize: { xs: 20, md: 24 } }} />
          )}
        </IconButton>
      )}
      
      {link ? (
        <Typography
          component={RouterLink}
          to={link}
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            color: '#5e5e5e',
            mt: 0.2,
            textDecoration: 'none',
            display: { xs: 'none', md: 'block' },
          }}
        >
          {label}
        </Typography>
      ) : (
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            color: '#5e5e5e',
            mt: 0.2,
            display: { xs: 'none', md: 'block' },
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  ))}
</Stack>

        {/* Right Side - Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, md: 4 }, mt: { xs: 1, md: 0 } }}>
          <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold', color: '#000', fontSize: { xs: '0.8rem', md: '1rem' }, display: { xs: 'none', sm: 'block' } }}>
            {profile?.fullName || 'User'}
          </Typography>
          <IconButton onClick={handleAvatarClick}>
             <Avatar
                          sx={{ width: 32, height: 32,}}
                          src={profile?.profileImage || 'https://via.placeholder.com/80'}
                          alt={profile?.fullName || 'User'}
                        />
             
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { mt: 1.5, borderRadius: 2, minWidth: 180 }
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
