import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import LogoutButton from '../components/LogoutButton';
const LandingPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Welcome to Our Fitness App</Typography>
      {/* Mock data components go here */}
      {/* ... */}
      {isAuthenticated ? (
        <LogoutButton / >
      ) : (
        <Button variant="contained" onClick={handleLogin}>Log In</Button>
      )}
    </Box>
  );
};

export default LandingPage;
