import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  TextField, 
  Stack 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const AboutSection = () => {
  const [aboutText, setAboutText] = useState('Passionate Software Engineer with 6+ years of experience in developing scalable web applications and working across the full stack.');
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            About
          </Typography>
          <IconButton onClick={toggleEdit} size="small" sx={{ backgroundColor: '#f5f5f5', '&:hover': { backgroundColor: '#e0e0e0' } }}>
            {isEditing ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
          </IconButton>
        </Stack>

        {isEditing ? (
          <TextField
            multiline
            minRows={5}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {aboutText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutSection;
