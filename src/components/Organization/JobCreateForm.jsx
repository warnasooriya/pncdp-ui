import React, { useState } from 'react';
import axios from '../../api/axios-recruiter';
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
    userId: localStorage.getItem('userId'),
    banner: '',
    title: '',
    location: '',
    type: '',
    description: '',
    deadline: '',
  });
  
  const [bannerPreview, setBannerPreview] = useState(null);

  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: '', success: '' });

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateBanner = async () => {
    setSubmitStatus({ loading: true, error: '', success: '' });
    try {
      // Replace with your actual banner generation logic
      const response = await axios.post('/api/recruiter/jobs/generate-banner', {
        description: formData.description,
        headers: { 'Content-Type': 'application/json' }
      });

      // console.log('Banner generation response:', response.data);
      setBannerPreview(response.data.originalUrl);
      setFormData((prev) => ({ ...prev, banner: response.data.imagePath }));
      
      setSubmitStatus({ loading: false, error: '', success: 'Banner generated successfully!' });
    } catch (err) {
      setSubmitStatus({ loading: false, error: 'Failed to generate banner.', success: '' });
      console.error('Error generating banner:', err);
    }
  };

 
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: '', success: '' });
 
    try {
      // Replace the URL with your actual backend endpoint
      await axios.post('/api/recruiter/jobs', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSubmitStatus({ loading: false, error: '', success: 'Job created successfully!' });
      // Optionally reset form
      setFormData({
        userId: localStorage.getItem('userId'),
        banner: '',
        title: '',
        location: '',
        type: '',
        description: '',
        deadline: '',
      });
      
      setBannerPreview(null);
    } catch (err) {
      setSubmitStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to create job.',
        success: ''
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', my: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Create a New Job Post
        </Typography>
        {/* Show success or error messages */}
        {submitStatus.success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {submitStatus.success}
          </Typography>
        )}
        {submitStatus.error && (
          <Typography color="error.main" sx={{ mb: 2 }}>
            {submitStatus.error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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

            <Button
              variant="outlined"
              component="label"
              sx={{ mb: 2 }}
              disabled={submitStatus.loading}
              onClick={generateBanner}
            >
              Generate Banner</Button>

 {/* Banner Upload Section */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Banner Image
              </Typography>
              
            
              {bannerPreview && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    style={{ maxWidth: '100%',  borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>

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

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={submitStatus.loading}
            >
              {submitStatus.loading ? 'Posting...' : 'Post Job'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default JobCreateForm;
