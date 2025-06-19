import React, { useState, useEffect } from 'react';
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
import axios from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setField } from '../../reducers/profileReducer';
import LoadingOverlay from '../common/LoadingOverlay';

const AboutSection = () => {
  const dispatch = useDispatch();
  const profileReducer = useSelector(state => state.profileReducer);
  const [aboutText, setAboutText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Load "about" on mount
  useEffect(() => {
    try {
      
      if (profileReducer?.profile) {
        setIsLoading(true);
        const profileInfo = profileReducer?.profile;
        console.log('AboutSection mounted with profile:', profileInfo);
        setAboutText(profileInfo?.about?.Description || '');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to load about data:', err);
    }
  }, [profileReducer.profile]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put('/api/profile/about', {
        description: aboutText,
        id: profileReducer.profile._id
      });

      // Refresh Redux store
      const res = await axios.get('/api/profile?id='+profileReducer.profile._id);
      dispatch(setField({ name: 'profile', value: res.data }));
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to save about info:', err);
      setIsLoading(false);
    }

    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <LoadingOverlay isLoading={isLoading} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            About
          </Typography>
          <IconButton
            onClick={toggleEdit}
            size="small"
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
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
            {aboutText || 'Tell us something about yourself...'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutSection;
