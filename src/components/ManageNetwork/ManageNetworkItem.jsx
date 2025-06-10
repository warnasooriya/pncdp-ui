/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Stack } from '@mui/material';

const ManageNetworkItem = () => {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: 'Emily Carter',
      title: 'UX Designer at InnovateLabs',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      id: 2,
      name: 'David Kim',
      title: 'Software Engineer at TechHive',
      avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    },
    {
      id: 3,
      name: 'Sophia Lee',
      title: 'Marketing Specialist at BrightAds',
      avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    },
    {
      id: 4,
      name: 'Michael Brown',
      title: 'Product Manager at CreateSpace',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    },
    {
      id: 5,
      name: 'Ava Johnson',
      title: 'Data Analyst at DataWorks',
      avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
    },
    {
      id: 6,
      name: 'James Wilson',
      title: 'Cloud Engineer at SkyNet Solutions',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    }
  ]);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh',   }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        My Network
      </Typography>

      <Grid container spacing={2}>
        {suggestions.map((user) => (
          <Grid item xs={12} sm={6} md={6} key={user.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 2, textAlign: 'center', '&:hover': { boxShadow: 4 } }}>
              <Stack spacing={4} alignItems="center">
                <Avatar
                  alt={user.name}
                  src={user.avatar}
                  sx={{ width: 80, height: 80 }}
                />
                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.title}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: 5, backgroundColor: '#283593', px: 3 }}
                >
                  Connect
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageNetworkItem;
