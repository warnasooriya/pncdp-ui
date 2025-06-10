import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MyNetwork from './pages/MyNetwork';
import JobDetailsPage from './components/Jobs/JobDetailsPage';
import JobsPage from './pages/JobsPage';
// import LoginPage from './pages/LoginPage'; // We'll create a basic one now

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/profile" element={<ProfilePage />} />
      {/* Add more routes here later if needed */}
      <Route path="/mynetwork" element={<MyNetwork />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
    </Routes>
  );
}

export default App;
