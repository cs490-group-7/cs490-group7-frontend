import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Link, Alert } from '@mui/material';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  function login() {
    if (email.length === 0) {
      setEmailError("Missing email.");
    } else if (email.length > 32) {
      setEmailError("Email too long.");
    } else if (!/^[a-zA-Z][a-zA-Z0-9]*\@[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z]{2,4}$/.test(email)) {
      setEmailError("Incorrect email format.");
    } else {
      setEmailError(null);
    }

    if (password.length === 0) {
      setPasswordError("Missing password.");
    } else if (password.length > 32) {
      setPasswordError("Password too long.");
    } else if (!/^[a-zA-Z0-9!#$%&()*+,./:;<=>?@[\]^_{|}~]+$/.test(password)) {
      setPasswordError("Incorrect password format.");
    } else {
      setPasswordError(null);
    }

    if (emailError == null && passwordError == null) {
      
        axios.post('/api/users/login', { email: email, password: password,})
        .then((res) => {
          if(res.data.length === 0){
            setErrorMessage(null);
            setSuccessMessage("Login successful");
          }
        })
        .catch((err) => {
          setErrorMessage("Server error");
          console.error(err)
        });
    }
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Log In</Typography>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <TextField sx={{ width: '398px' }} id="inpEmail" label="Email" variant="filled" error={emailError} helperText={emailError} required value={email} onChange={(event) => {
              setEmail(event.target.value);
            }} />
          </Grid>
          <Grid item xs={12}>
            <TextField id="inpPassword" label="Password" variant="filled" error={passwordError} helperText={passwordError} required type="password" value={password} onChange={(event) => {
              setPassword(event.target.value);
            }} />
          </Grid>
          <Grid item xs={12}>
            <Button id="loginBtn" variant="contained" onClick={() => {
              login();
            }}>
              Log In
            </Button>
          </Grid>
          <Grid item xs={12}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
          </Grid>
          <Grid item xs={12}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default LoginPage;