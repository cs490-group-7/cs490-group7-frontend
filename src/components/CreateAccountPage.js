import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateAccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [isCoach, setIsCoach] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfError, setPasswordConfError] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
 function createAccount() {
  let valid = true;

    if (firstName.length === 0) {
      setFirstNameError("Missing first name.");
    } else if (firstName.length > 32) {
      setFirstNameError("First name too long.");
    } else if (!/^[a-zA-Z]( ?[a-zA-Z]*)*$/.test(firstName)) {
      setFirstNameError("First name disallowed format.");
    } else {
      setFirstNameError(null);
    }

    if (lastName.length === 0) {
      setLastNameError("Missing last name.");
    } else if (lastName.length > 32) {
      setLastNameError("Last name too long.");
    } else if (!/^[a-zA-Z]( ?[a-zA-Z]*)*$/.test(lastName)) {
      setLastNameError("Last name disallowed format.");
    } else {
      setLastNameError(null);
    }

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

    if (password !== passwordConf) {
      setPasswordConfError("Passwords don't match.");
    } else {
      setPasswordConfError(null);
    }

    let serverCheck = false;
    if (firstNameError == null && lastNameError == null && emailError == null && passwordError == null && passwordConfError == null) {

     axios.post('/api/users/register', { firstName: firstName, lastName: lastName, email: email, password: password, isCoach: isCoach,})
     .then((res) => {
      if (res.status === 200) {
        // Successful account creation
        setErrorMessage(null);
        setSuccessMessage(res.data.message);
        serverCheck = true;
      } else if (res.status === 400) {
       // Invalid credentials
       setErrorMessage(res.data.message);
       setSuccessMessage(null);
      }
    })
    .catch((err) => {
     // Server error
     setErrorMessage("Server error");
     console.error(err);
   });
  

   if (valid && serverCheck) {
    navigate('/initial-survey', { state: { isCoach: isCoach } });
  }
}
    }
  

  return (
    <div>
      <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Account</Typography>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <TextField id="inpFirstName" label="First Name" variant="filled" error={firstNameError} helperText={firstNameError} required value={firstName} onChange={(event) => {
                  setFirstName(event.target.value);
                }}/>
              </Grid>
              <Grid item>
                <TextField id="inpLastName" label="Last Name" variant="filled" error={lastNameError} helperText={lastNameError} required value={lastName} onChange={(event) => {
                  setLastName(event.target.value);
                }}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField sx={{ width: '398px' }} id="inpEmail" label="Email" variant="filled" error={emailError} helperText={emailError} required value={email} onChange={(event) => {
              setEmail(event.target.value);
            }}/>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <TextField id="inpPassword" label="Password" variant="filled" error={passwordError} helperText={passwordError} required type="password" value={password} onChange={(event) => {
                  setPassword(event.target.value);
                }}/>
              </Grid>
              <Grid item>
                <TextField id="inpPasswordConf" label="Confirm Password" variant="filled" error={passwordConfError} helperText={passwordConfError} required type="password" value={passwordConf} onChange={(event) => {
                  setPasswordConf(event.target.value);
                }}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={isCoach}
              onChange={(event) => setIsCoach(event.target.value)}
              select
              sx={{ width: "150px" }}
              label="I am primarily a..."
            >
              <MenuItem value={false}>
                Client
              </MenuItem>
              <MenuItem value={true}>
                Coach
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button id="createAccountBtn" variant="contained" onClick={() => {
              createAccount();
            }}>
              Create Account
            </Button>
          </Grid>
          <Grid item xs={12}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default CreateAccountPage;
