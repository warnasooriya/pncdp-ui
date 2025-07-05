import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Dialog,
  Chip,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from '../../api/axios-recruiter';
import ApplicantsListDialog from './ApplicantsListPage';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";

const PublishedJobsTable = () => {
  const [jobs, setJobs] = useState([]);
  
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const orgId = localStorage.getItem('userId');
      const response = await axios.get(`/api/recruiter/jobs/byowner/${orgId}`);
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

   

  return (
    <Box p={3} width="100%">
      <Typography variant="h5" mb={3} fontWeight="bold">
        Published Jobs & Applications
      </Typography>

      <Paper elevation={3} sx={{ width: '100%', overflowX: 'auto', borderRadius: 3 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Published</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Applications</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs?.map((job) => (
              <TableRow key={job._id} hover>
                <TableCell width="40%">
                  <Typography fontWeight="bold">{job.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {job.description}
                  </Typography>
                </TableCell>

                <TableCell>{job.location}</TableCell>

                <TableCell>
                  <Chip label={job.jobType} size="small" color="primary" />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {dayjs(job.createdAt).format('YYYY-MM-DD HH:mm')}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={`${job.applicationCount || 0} `}
                    color="secondary"
                    variant="filled"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title="View Applicants">
                    <IconButton onClick={() => navigate(`/job-applications/${job._id}`)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

       
    </Box>
  );
};

export default PublishedJobsTable;
