import React from 'react';
import { Box, Grid} from '@mui/material';
import JobItems from '../components/Jobs/JobItems';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
 
const JobsPage = () => {
  

  return (

    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
    <TopNav />
    <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 4 }}>
      <LeftSidebar />
      <JobItems />
    </Box>
  </Box>
 
      
  );
};

export default JobsPage;
