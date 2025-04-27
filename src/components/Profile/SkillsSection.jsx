import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip, 
  IconButton, 
  TextField, 
  Button 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const SkillsSection = () => {
  const [skills, setSkills] = useState([
    'React.js',
    'Node.js',
    'AWS',
    'MongoDB',
    'Docker',
  ]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter(skill => skill !== skillToDelete));
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Skills
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Add a skill"
            size="small"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSkill}
            sx={{ textTransform: 'none' }}
          >
            Add
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleDeleteSkill(skill)}
              variant="outlined"
              sx={{
                borderRadius: '20px',
                px: 2,
                py: 1,
                fontWeight: 500,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#e8eaf6',
                  borderColor: '#3f51b5',
                  color: '#3f51b5',
                }
              }}
              deleteIcon={<CloseIcon />}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
