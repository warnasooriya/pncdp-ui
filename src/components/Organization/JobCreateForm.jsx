import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Stack
} from '@mui/material';

const JobCreateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    description: '',
    deadline: '',
  });

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Created:', formData);
    // TODO: Send formData to backend API here
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', my: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Create a New Job Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>

            <TextField
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              select
              label="Job Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
              required
            >
              {jobTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={4}
              required
            />

            <TextField
              label="Application Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Post Job
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default JobCreateForm;
