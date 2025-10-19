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
import TopNav from '../Layout/TopNav';
import { useNavigate } from "react-router-dom";
import LoadingOverlay from '../common/LoadingOverlay';
const JobCreateForm = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: localStorage.getItem('userId'),
    banner: '',
    title: '',
    location: '',
    type: '',
    description: '',
    deadline: '',
    requirements: [],
  });
  
  const [bannerPreview, setBannerPreview] = useState(null);
const [newRequirement, setNewRequirement] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: '', success: '' });

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateBanner = async () => {
    // Validate required fields before generating banner
    if (!formData.description || formData.description.length < 50) {
      setSubmitStatus({ 
        loading: false, 
        error: 'Please provide a detailed job description (at least 50 characters) before generating a banner.', 
        success: '' 
      });
      return;
    }

    if (!formData.title) {
      setSubmitStatus({ 
        loading: false, 
        error: 'Please provide a job title before generating a banner.', 
        success: '' 
      });
      return;
    }

    setSubmitStatus({ loading: true, error: '', success: '' });
    try {
      // Enhanced banner generation with more context
      const response = await axios.post('/api/recruiter/jobs/generate-banner', {
        title: formData.title,
        description: formData.description,
        skills: formData.requirements,
        location: formData.location,
        type: formData.type
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Banner generation response:', response.data);
      setBannerPreview(response.data.originalUrl);
      setFormData((prev) => ({ ...prev, banner: response.data.imagePath }));
      
      setSubmitStatus({ 
        loading: false, 
        error: '', 
        success: 'Professional banner generated successfully! The banner is designed to match your job description and requirements.' 
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to generate banner. Please try again.';
      setSubmitStatus({ 
        loading: false, 
        error: `Banner Generation Error: ${errorMessage}`, 
        success: '' 
      });
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
        requirements: []
      });
      
      setBannerPreview(null);

      // wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);

    } catch (err) {
      setSubmitStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to create job.',
        success: ''
      });
    }
  };

  return (
    <>
  
    <TopNav />
    
    <Box sx={{ maxWidth: 700, mx: 'auto', my: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Create a New Job Post
        </Typography>
        <LoadingOverlay isLoading={submitStatus.loading} />
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

           
           <Box>
  <Typography variant="subtitle1" sx={{ mt: 2 }}>
     Requirements
  </Typography>
  <Stack direction="row" spacing={2} alignItems="center">
    <TextField
      label="Add Requirement"
      value={newRequirement}
      onChange={(e) => setNewRequirement(e.target.value)}
      fullWidth
    />
    <Button
      variant="contained"
      onClick={() => {
        if (newRequirement.trim()) {
          setFormData((prev) => ({
            ...prev,
            requirements: [...prev.requirements, newRequirement.trim()],
          }));
          setNewRequirement('');
        }
      }}
    >
      Add
    </Button>
  </Stack>

  {/* Display list of added requirements */}
  <Stack spacing={1} sx={{ mt: 2 }}>
    {formData.requirements.map((req, index) => (
      <Box
        key={index}
        sx={{
          px: 2,
          py: 1,
          backgroundColor: '#f3f4f6',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2">{req}</Typography>
        <Button
          variant="text"
          size="small"
          color="error"
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              requirements: prev.requirements.filter((_, i) => i !== index),
            }));
          }}
        >
          Remove
        </Button>
      </Box>
    ))}
  </Stack>
</Box>

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
              sx={{ 
                mb: 2,
                textTransform: 'none',
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
              disabled={submitStatus.loading || !formData.title || !formData.description}
              onClick={generateBanner}
            >
              {submitStatus.loading ? 'Generating Professional Banner...' : 'Generate AI Banner'}
            </Button>
            
            {(!formData.title || !formData.description) && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Please fill in the job title and description first to generate a matching banner.
              </Typography>
            )}

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
    
      </>
  );
};

export default JobCreateForm;
