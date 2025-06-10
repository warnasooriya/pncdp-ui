import React from 'react';
import { Box, Stack, Card, Typography, Divider, Avatar, Button } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';

const RightSidebar = () => {
  return (
    <Box sx={{ width: '25%', display: { xs: 'none', md: 'block' } }}>
      <Stack spacing={2}>

        {/* Trending Topics */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Trending Topics
          </Typography>
          <Stack spacing={1}>
            {['#cloudcomputing', '#software', '#marketing', '#ai', '#cybersecurity'].map((topic, index) => (
              <Typography key={index} variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                {topic}
              </Typography>
            ))}
          </Stack>
        </Card>

        {/* Jobs for You */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Jobs for You
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WorkOutlineIcon sx={{ color: '#5e5e5e' }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Frontend Developer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Web Solutions
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <WorkOutlineIcon sx={{ color: '#5e5e5e' }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Product Manager
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  InnovateHub
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Card>

        {/* Upcoming Events */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Upcoming Events
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EventNoteIcon sx={{ color: '#5e5e5e' }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Tech Conference 2024
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  May 10
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Card>

        {/* Advertisement Card */}
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Advertisement
          </Typography>
          <Avatar
            src="https://source.unsplash.com/featured/?technology"
            alt="Ad"
            variant="rounded"
            sx={{ width: '100%', height: 100, my: 2, borderRadius: 2 }}
          />
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
            Learn More
          </Button>
        </Card>

      </Stack>
    </Box>
  );
};

export default RightSidebar;