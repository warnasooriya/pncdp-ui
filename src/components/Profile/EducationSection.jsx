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
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const EducationSection = () => {
  const [educationList, setEducationList] = useState([
    {
      degree: 'BSc in Computer Science',
      university: 'Stanford University',
      duration: '2015 - 2019',
      description: 'Focused on Software Engineering, AI, and Data Structures.',
      logo: 'https://static.sliit.lk/wp-content/uploads/2017/12/sliit-web-logo.png'
    },
    {
      degree: 'MSc in Data Science',
      university: 'Massachusetts Institute of Technology',
      duration: '2019 - 2021',
      description: 'Specialized in Machine Learning and Big Data Analytics.',
      logo: 'https://lh4.googleusercontent.com/lQAv6eGKCBVJXbAphQzeEvXZbCfOA5_ANt_edK_LXyWInVHlfL9iNbzGEfHp3L4lQ6iVhVvsOcCn7yfk8b5uI6k=w16383'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({ degree: '', university: '', duration: '', description: '', logo: '' });
  const [editIndex, setEditIndex] = useState(null);

  const handleOpenDialog = () => {
    setCurrentEducation({ degree: '', university: '', duration: '', description: '', logo: '' });
    setEditIndex(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveEducation = () => {
    if (editIndex !== null) {
      const updated = [...educationList];
      updated[editIndex] = currentEducation;
      setEducationList(updated);
    } else {
      setEducationList([...educationList, currentEducation]);
    }
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    setCurrentEducation(educationList[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Education
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
          {educationList.map((edu, index) => (
            <Box key={index}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar 
                  src={edu.logo || ''} 
                  alt="University Logo" 
                  sx={{ bgcolor: '#e0e0e0', width: 56, height: 56 }}
                >
                  <SchoolIcon />
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.university} • {edu.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {edu.description}
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
              {index !== educationList.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Edit Education" : "Add Education"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Degree or Qualification"
            value={currentEducation.degree}
            onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
            fullWidth
          />
          <TextField
            label="University / Institute"
            value={currentEducation.university}
            onChange={(e) => setCurrentEducation({ ...currentEducation, university: e.target.value })}
            fullWidth
          />
          <TextField
            label="Duration (e.g., 2015 - 2019)"
            value={currentEducation.duration}
            onChange={(e) => setCurrentEducation({ ...currentEducation, duration: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description (optional)"
            value={currentEducation.description}
            onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="University Logo URL (optional)"
            value={currentEducation.logo}
            onChange={(e) => setCurrentEducation({ ...currentEducation, logo: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEducation}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EducationSection;
