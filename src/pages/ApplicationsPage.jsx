import React from 'react';
import { Box, Grid} from '@mui/material';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
import PublishedJobsTable from '../components/Jobs/PublishedJobsTable';
 
const ApplicationsPage = () => {
  

  return (

    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
    <TopNav />
    <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 4 }}>
      <LeftSidebar />
      <PublishedJobsTable />
    </Box>
  </Box>
 
      
  );
};

export default ApplicationsPage;
