import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Alert} from '@mui/material'
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function LoginPage () {

  const { login: contextLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  function login () {
    let isValid = true;

    if (email.length === 0) {
      setEmailError("Missing email.");
      isValid = false;
    } else if (email.length > 32) {
      setEmailError("Email too long.");
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError("Incorrect email format.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (password.length === 0) {
      setPasswordError("Missing password.");
      isValid = false;
    } else if (password.length > 32) {
      setPasswordError("Password too long.");
      isValid = false;
    } else if (!/^[a-zA-Z0-9!#$%&()*+,./:;<=>?@[\]^_{|}~]+$/.test(password)) {
      setPasswordError("Incorrect password format.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    // trigger call to the backend
    
    // If there are no errors, proceed with login
      if (isValid) {
        const loginData = {
          email: email,
          password: password
        };
  
        axios.post(`${baseUrl}/api/users/login`, loginData)
          .then(response => {
            if (response.data.message === "Logged in successfully") {
              console.log('Login successful', response.data);
              localStorage.setItem('userType', response.data.userType);
              contextLogin(response.data.token, response.data.userType);
              // Redirect to the homepage
              let user_id = response.data.ident;
              let userType = response.data.userType
            navigate('/dashboard', { state: { user_id, userType } });

            } else {
              console.error('Login failed:', response.data.message);
              // Show user feedback here
            }
          })
          .catch(error => {
            setErrorMessage('Login error');
            if (error.response) {
              console.error('Login error:', error.response.data);
              // Show user feedback here
            } else if (error.request) {
              console.error('Login error:', error.request);
              // Show user feedback here
            } else {
              console.error('Login error:', error.message);
              // Show user feedback here
            }
          });
      }

  
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <h1>Login</h1>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TextField sx={{ width: '398px' }}id="inpEmail" label="Email" variant="filled" error={!!emailError} helperText={emailError || ' '} required value={email} onChange={(event) => {
            setEmail(event.target.value);
            setEmailError('');
          }}/>
        </Grid>
        <Grid item xs={12}>
          <TextField id="inpPassword" label="Password" variant="filled" error={!!passwordError} helperText={passwordError || ' '} required type="password" value={password} onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError('');
          }}/>
        </Grid>
        <Grid item xs={12}>
          <Button id="loginBtn" variant="contained" onClick={() => {
            login();
          }}>
            Log In
          </Button>
        </Grid>
        <Grid item xs={12}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </Grid>
      </Grid>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  )

}

export default LoginPage