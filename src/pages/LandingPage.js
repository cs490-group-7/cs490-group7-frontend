import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material'
import { useLocation } from 'react-router-dom';

function LandingPage () {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="center">
      <Typography variant="h4" sx={{ fontWeight: 'bold', margin: 1 }}>Welcome to our site!</Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', margin: 1 }}>Our app allows you to stay on top of your workout routine to get the results you need via our workout session logger and coach interaction system. Sign up today!</Typography>
      <div><Button id="btnCreate" variant="contained" sx={{ margin: 1 }} style={{ textDecoration: 'none', width: '175px' }}>
        <a
          className={location.pathname === '/create-account' ? 'active' : ''}
          href="/create-account"
          style= {{ textDecoration: "none", color: 'white' }}
        >
          Create Account
        </a>
      </Button></div>
      <div><Button id="btnLogin" variant="contained" sx={{ margin: 1 }} style={{ textDecoration: 'none', width: '175px' }}>
        <a
          className={location.pathname === '/login' ? 'active' : ''}
          href="/login"
          style= {{ textDecoration: "none", color: 'white' }}
        >
          Log in
        </a>
      </Button></div>
    </Box>
  )

}

export default LandingPage