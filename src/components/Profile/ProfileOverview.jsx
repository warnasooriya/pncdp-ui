import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Stack,
  Box,
  Button
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import {  useDispatch,useSelector } from 'react-redux';
import axios from '../../api/axios';
import { setField } from '../../reducers/profileReducer';
import LoadingOverlay from '../common/LoadingOverlay';

const ProfileOverview = () => {
   
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
   const [userId] = useState(localStorage.getItem('userId')); // Assuming user ID is stored in localStorage
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const profileReducer = useSelector(state => state.profileReducer);
  const [isLoading, setIsLoading] = useState(false);
  const userType = localStorage.getItem('userType');

  // Fetch profile on mount
 useEffect(() => {
    try {
      if (profileReducer?.profile) {
        setIsLoading(true);
        // console.log('Profile Overview mounted with profile:', profileReducer.profile);
        const profileInfo = profileReducer.profile; // Assuming it's a JSON string
        setFullName(profileInfo?.fullName || '');
        setHeadline(profileInfo?.headline || '');
        setProfileImage(profileInfo?.profileImage || '');
        setBannerImage(profileInfo?.bannerImage || '');
        setIsLoading(false);
      }
    } catch (error) {
       setIsLoading(false);
      console.error('Failed to parse profile:', error);
    }
  }, [profileReducer.profile]); // 👈 use profile as a dependency

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file);
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(URL.createObjectURL(file));
      setBannerImageFile(file);
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      // Save changes
      try {
        setIsLoading(true);
        await axios.put('/api/candidate/profile', { fullName, headline, id:userId});

        if (profileImageFile || bannerImageFile) {
          const formData = new FormData();
          
          if (profileImageFile) formData.append('profileImage', profileImageFile);
          if (bannerImageFile) formData.append('bannerImage', bannerImageFile);
          
          formData.append('id', userId); // Assuming userId is stored in localStorage
          const uploadRes = await axios.post('/api/candidate/profile/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          // Update preview URLs after upload
          setProfileImage(uploadRes.data.profileImage);
          setBannerImage(uploadRes.data.bannerImage);
          setProfileImageFile(null);
          setBannerImageFile(null);
          
        }

        axios.get('/api/candidate/profile?id='+userId)
      .then(res => {
        dispatch(setField({ name: 'profile', value: res.data }));
        setIsLoading(false);
      })
      .catch(err => console.error('Error fetching profile', err));

      } catch (error) {
        console.error('Failed to save profile', error);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
      
      {/* Banner Image */}
      <Box sx={{ position: 'relative', height: 200, backgroundColor: '#e0e0e0' }}>
         <LoadingOverlay isLoading={isLoading} />
        {bannerImage ? (
          <CardMedia
            component="img"
            height="200"
            image={bannerImage}
            alt="Banner"
            sx={{ objectFit: 'cover', width: '100%' }}
          />
        ) : (
          <Box sx={{ height: '100%', width: '100%', backgroundColor: '#c5c5c5' }} />
        )}
        {isEditing && (
          <label htmlFor="banner-upload">
            <IconButton
              component="span"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#f0f0f0' }
              }}
            >
              <PhotoCamera />
            </IconButton>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleBannerImageChange}
            />
          </label>
        )}
      </Box>

      {/* Profile Info */}
      <CardContent sx={{ position: 'relative', mt: -5 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          {/* Avatar */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profileImage}
              alt="Profile Picture"
              sx={{ width: 120, height: 120, border: '4px solid white' }}
            />
            {isEditing && (
              <label htmlFor="profile-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfileImageChange}
                />
              </label>
            )}
          </Box>

          {/* Name and Headline */}
          <Stack spacing={1} flexGrow={1}>
            {isEditing ? (
              <>
                <TextField
                  variant="standard"
                  value={fullName}
                  placeholder= {userType === 'Candidate' ? "Name" : "Organization Name"}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 26, fontWeight: 700 }
                  }}
                />
                <TextField
                  variant="standard"
                  value={headline}
                   placeholder= {userType === 'Candidate' ? "Occupation" : "Description"}
                  onChange={(e) => setHeadline(e.target.value)}
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 16, color: 'gray' }
                  }}
                />
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight="bold">
                  {fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {headline}
                </Typography>
              </>
            )}
          </Stack>

          {/* Edit Button */}
          <Button
            startIcon={<EditIcon />}
            onClick={toggleEdit}
            sx={{ textTransform: 'none', height: 40 }}
            variant="outlined"
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
