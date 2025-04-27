import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  IconButton, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Divider, 
  Box, 
  Avatar 
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ExperienceSection = () => {
  const [experienceList, setExperienceList] = useState([
    {
      title: 'Senior Software Engineer',
      company: 'TechNova Inc.',
      duration: 'Jan 2020 - Present',
      description: 'Leading a team of developers to build scalable cloud applications for fintech clients.',
      logo: 'http://www.trivow.com/assets/images/logo.svg'
    },
    {
      title: 'Frontend Developer',
      company: 'Webify Solutions',
      duration: 'Jun 2017 - Dec 2019',
      description: 'Worked on building responsive web interfaces using React and improving user experiences.',
      logo: 'https://solutions.cicra.lk/wp-content/uploads/2018/10/logo.png'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({ title: '', company: '', duration: '', description: '', logo: '' });
  const [editIndex, setEditIndex] = useState(null);

  const handleOpenDialog = () => {
    setCurrentExperience({ title: '', company: '', duration: '', description: '', logo: '' });
    setEditIndex(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveExperience = () => {
    if (editIndex !== null) {
      const updated = [...experienceList];
      updated[editIndex] = currentExperience;
      setExperienceList(updated);
    } else {
      setExperienceList([...experienceList, currentExperience]);
    }
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    setCurrentExperience(experienceList[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updated = experienceList.filter((_, i) => i !== index);
    setExperienceList(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Experience
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />} 
            onClick={handleOpenDialog}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Add
          </Button>
        </Stack>

        <Stack spacing={3}>
          {experienceList.map((exp, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar 
                  src={exp.logo || ''} 
                  alt="Company Logo" 
                  sx={{ bgcolor: '#e0e0e0', width: 56, height: 56 }}
                >
                  <WorkOutlineIcon />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} • {exp.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {exp.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              {index !== experienceList.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Edit Experience" : "Add Experience"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Job Title"
            value={currentExperience.title}
            onChange={(e) => setCurrentExperience({ ...currentExperience, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Company Name"
            value={currentExperience.company}
            onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
            fullWidth
          />
          <TextField
            label="Duration (e.g., Jan 2020 - Present)"
            value={currentExperience.duration}
            onChange={(e) => setCurrentExperience({ ...currentExperience, duration: e.target.value })}
            fullWidth
          />
          <TextField
            label="Job Description"
            value={currentExperience.description}
            onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Company Logo URL (optional)"
            value={currentExperience.logo}
            onChange={(e) => setCurrentExperience({ ...currentExperience, logo: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveExperience}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ExperienceSection;
