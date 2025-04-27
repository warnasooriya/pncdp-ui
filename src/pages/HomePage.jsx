import React from 'react';
import { Box } from '@mui/material';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
import CenterFeed from '../components/Layout/CenterFeed';
import RightSidebar from '../components/Layout/RightSidebar';

const HomePage = () => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />
        <CenterFeed />
        <RightSidebar />
      </Box>
    </Box>
  );
};

export default HomePage;
