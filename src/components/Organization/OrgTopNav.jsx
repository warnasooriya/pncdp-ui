import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Stack, Button, Badge } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link as RouterLink } from 'react-router-dom';

const OrgTopNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {/* Left - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          <img src="/logo.png" alt="Logo" style={{ height: '60px' }} />
          <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold', ml: 1 }}>
            OrgDashboard
          </Typography>
        </Box>

        {/* Center - Icon Navigation */}
        <Stack direction="row" spacing={4} alignItems="center">
          {[
            { icon: HomeIcon, label: 'Dashboard', link: '/org-dashboard' },
            { icon: BusinessCenterIcon, label: 'Jobs', link: '/org-jobs' },
            { icon: PeopleAltIcon, label: 'Applicants', link: '/org-applicants' },
            { icon: NotificationsIcon, label: 'Alerts', badge: 3 },
          ].map(({ icon: Icon, label, link, badge }, i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton component={RouterLink} to={link}>
                {badge ? (
                  <Badge badgeContent={badge} color="error">
                    <Icon sx={{ color: '#5e5e5e' }} />
                  </Badge>
                ) : (
                  <Icon sx={{ color: '#5e5e5e' }} />
                )}
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#5e5e5e' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Right - Create Job + Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            size="small"
            component={RouterLink}
            to="/org-create-job"
            sx={{ mr: 2, borderRadius: 3 }}
          >
            Create Job
          </Button>
          <Typography sx={{ mr: 1, fontWeight: 'bold', color: '#000' }}>OrgTech Inc.</Typography>
          <IconButton onClick={handleAvatarClick}>
            <Avatar alt="OrgTech Inc." src="/org-avatar.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default OrgTopNav;
