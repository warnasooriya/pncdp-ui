import React, {  useEffect } from 'react';
import ProfileOverview from '../components/Profile/ProfileOverview';
import AboutSection from '../components/Profile/AboutSection';
import ExperienceSection from '../components/Profile/ExperienceSection';
import EducationSection from '../components/Profile/EducationSection';
import SkillsSection from '../components/Profile/SkillsSection';
import CertificationsSection from '../components/Profile/CertificationsSection';
import PortfolioSection from '../components/Profile/PortfolioSection';
import { Box } from '@mui/material';
import TopNav from '../components/Layout/TopNav';
import LeftSidebar from '../components/Layout/LeftSidebar';
import RightSidebar from '../components/Layout/RightSidebar';
import { setField } from '../reducers/profileReducer';
import { useDispatch } from 'react-redux';
import axios from '../api/axios';
const ProfilePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
     axios.get('/api/profile?id='+localStorage.getItem('userId'))
      .then(res => {
        dispatch(setField({ name: 'profile', value: res.data }));
      })
      .catch(err => console.error('Error fetching profile', err));
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
      <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
        <LeftSidebar />
        <div style={{ flex: 1 }}>

      <ProfileOverview />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <CertificationsSection />
      <PortfolioSection />
        </div>
    
        <RightSidebar />
      </Box>
    </Box>
      
  );
};

export default ProfilePage;
