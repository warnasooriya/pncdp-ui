import React from 'react';
import { Box, Stack, Card, Typography, Button, Avatar, Divider } from '@mui/material';

const RightSidebar = () => {
  // Dummy people you may know data
  const people = [
    { name: 'Jane Smith', title: 'Product Manager', avatar: '' },
    { name: 'Michael Brown', title: 'UI/UX Designer', avatar: '' },
    { name: 'David Lee', title: 'Software Engineer', avatar: '' },
  ];

  return (
    <Box sx={{ width: '25%', display: { xs: 'none', md: 'block' } }}>
      <Stack spacing={2}>
        {/* People You May Know */}
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            People You May Know
          </Typography>
          <Stack spacing={2}>
            {people.map((person, index) => (
              <Stack key={index} direction="row" alignItems="center" spacing={2}>
                <Avatar src={person.avatar} alt={person.name} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {person.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {person.title}
                  </Typography>
                </Box>
                <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#283593' }}>
                  Connect
                </Button>
              </Stack>
            ))}
          </Stack>
        </Card>

        {/* Trending Topics */}
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Trending Topics
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="primary">#AI</Typography>
            <Typography variant="body2" color="primary">#ReactJS</Typography>
            <Typography variant="body2" color="primary">#CareerGrowth</Typography>
            <Typography variant="body2" color="primary">#Blockchain</Typography>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};

export default RightSidebar;
