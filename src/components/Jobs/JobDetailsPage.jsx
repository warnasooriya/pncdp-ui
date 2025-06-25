import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';

import TopNav from '../Layout/TopNav';
import LeftSidebar from '../Layout/LeftSidebar';
import RightSidebar from '../Layout/RightSidebar';

import { useSelector } from 'react-redux';

const JobDetailsPage = () => {
  const { jobs } = useSelector((state) => state.jobsReducer);
  const { id } = useParams();
  const navigate = useNavigate();

  const job = jobs.find((job) => job._id === id);

  if (!job) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Job not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />

        {/* Center Job Content */}
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, p: 0, backgroundColor: 'white' }}>
            {/* Banner Image */}
            {job.banner && (
              <Box
                sx={{
                  width: '100%',
                  // height: 250,
                  overflow: 'hidden',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12
                }}
              >
                <img
                  src={job.banner}
                  alt="Job Banner"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}

            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Stack spacing={2} mb={3}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2} alignItems="center">
                    {job?.user?.picture && (
                      <Avatar src={job?.user?.picture} alt={job?.user?.name} sx={{ width: 64, height: 64 }} />
                    )}
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job?.user?.name} | {job.location}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" title="Back" onClick={() => navigate(-1)}>
                      <ArrowBackIcon />
                    </IconButton>
                    <IconButton color="primary" title="Save">
                      <BookmarkBorderIcon />
                    </IconButton>
                    <IconButton color="primary" title="Share">
                      <ShareIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Divider />
              </Stack>

              {/* Job Type */}
              <Stack direction="row" spacing={1} mb={2}>
                <Chip label={job.jobType} size="small" color="primary" />
              </Stack>

              {/* Description */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Job Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {job.description}
                </Typography>
              </Box>

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    Requirements
                  </Typography>
                  <ul style={{ paddingLeft: '20px' }}>
                    {job.requirements.map((req, index) => (
                      <li key={index}>
                        <Typography variant="body2" color="text.secondary">
                          {req}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {/* Publisher Info */}
              {job.postedBy && (
                <Box mt={2} mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Published by
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={job.postedBy.logo}
                      alt={job.postedBy.name}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {job.postedBy.name}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {/* Apply Now */}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Apply Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <RightSidebar />
      </Box>
    </Box>
  );
};

export default JobDetailsPage;
