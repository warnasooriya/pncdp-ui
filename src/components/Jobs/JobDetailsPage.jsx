import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, Chip, Card, CardContent, Avatar, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Add
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Add
 
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import TopNav from '../Layout/TopNav';
import LeftSidebar from '../Layout/LeftSidebar';
import RightSidebar from '../Layout/RightSidebar';

const jobDetailsData = {
  1: {
    title: 'Frontend Developer',
    company: 'TechNova',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a skilled Frontend Developer with experience in React.js and Material UI to join our dynamic team.',
    requirements: [
      '3+ years of experience in frontend development',
      'Strong skills in React.js, JavaScript, and CSS',
      'Experience with Material UI is a plus',
      'Good understanding of REST APIs',
    ],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
  2: {
    title: 'Data Analyst',
    company: 'DataWorks',
    location: 'Colombo, Sri Lanka',
    type: 'Part-time',
    description: 'Seeking a data enthusiast with strong analytical skills and experience in SQL and Python.',
    requirements: [
      '2+ years experience in data analysis',
      'Proficient in SQL and Python',
      'Familiar with BI tools like Power BI or Tableau',
    ],
    logo: '',
  },
  3: {
    title: 'Product Manager',
    company: 'InnovateHub',
    location: 'Remote',
    type: 'Full-time',
    description: 'Looking for a Product Manager who can drive innovation and lead cross-functional teams effectively.',
    requirements: [
      '5+ years experience in Product Management',
      'Excellent communication and leadership skills',
      'Experience working with agile teams',
    ],
    logo: '',
  },
  4: {
    title: 'UI/UX Designer',
    company: 'BrightApps',
    location: 'Kandy, Sri Lanka',
    type: 'Contract',
    description: 'We need a creative UI/UX Designer to design intuitive and beautiful web applications.',
    requirements: [
      'Strong portfolio of design projects',
      'Experience with Figma, Adobe XD, or Sketch',
      'Knowledge of responsive design best practices',
    ],
    logo: '',
  },
  
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const job = jobDetailsData[id];
  const navigate = useNavigate(); 

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
           

          <Card variant="outlined" sx={{ borderRadius: 3, p: 3, backgroundColor: 'white' }}>
            <CardContent>
              {/* Job Header */}
              <Stack spacing={2} mb={3}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2} alignItems="center">
                    {job.logo && (
                      <Avatar src={job.logo} alt={job.company} sx={{ width: 64, height: 64 }} />
                    )}
                    <Box>
                      <Typography variant="h5" fontWeight="bold">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{job.company} • {job.location}</Typography>
                    </Box>
                  </Stack>

                  {/* Save and Share */}
                  <Stack direction="row" spacing={1}>

                    <IconButton color="primary" title='Back' onClick={() => navigate(-1)}>
                      <ArrowBackIcon />
                    </IconButton>

                    <IconButton color="primary" title='Save'>
                      <BookmarkBorderIcon />
                    </IconButton>
                    <IconButton color="primary" title='Share'>
                      <ShareIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Divider />
              </Stack>

              

              {/* Job Type */}
              <Stack direction="row" spacing={1} mb={2}>
                <Chip label={job.type} size="small" color="primary" />
              </Stack>

              {/* Job Description */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Job Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {job.description}
                </Typography>
              </Box>

              {/* Requirements */}
              <Box>
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

              {/* Apply Now */}
              <Box sx={{ mt: 4 }}>
                <Button variant="contained" size="large" fullWidth sx={{ textTransform: 'none', borderRadius: 2 }}>
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
