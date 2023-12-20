import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, Typography, TextField, Select, MenuItem, Button, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function CreateAccountPage () {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [phone, setPhone] = useState("")
  const [isCoach, setIsCoach] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfError, setPasswordConfError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState("");

  function createAccount () {
    let valid = true;

    if (firstName.length === 0) {
      setFirstNameError("Missing first name.");
      valid = false
    } else if (firstName.length > 32) {
      setFirstNameError("First name too long.");
      valid = false
    } else if (!/^[a-zA-Z]( ?[a-zA-Z]*)*$/.test(firstName)) {
      setFirstNameError("First name disallowed format.");
      valid = false
    } else {
      setFirstNameError(null);
    }

    if (lastName.length === 0) {
      setLastNameError("Missing last name.");
      valid = false
    } else if (lastName.length > 32) {
      setLastNameError("Last name too long.");
      valid = false
    } else if (!/^[a-zA-Z]( ?[a-zA-Z]*)*$/.test(lastName)) {
      setLastNameError("Last name disallowed format.");
      valid = false
    } else {
      setLastNameError(null);
    }

    if (email.length === 0) {
      setEmailError("Missing email.");
      valid = false
    } else if (email.length > 32) {
      setEmailError("Email too long.");
      valid = false
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError("Incorrect email format.");
      valid = false
    } else {
      setEmailError(null);
    }

    if (password.length === 0) {
      setPasswordError("Missing password.");
      valid = false
    } else if (password.length > 32) {
      setPasswordError("Password too long.");
      valid = false
    } else if (!/^[a-zA-Z0-9!#$%&()*+,./:;<=>?@[\]^_{|}~]+$/.test(password)) {
      setPasswordError("Incorrect password format.");
      valid = false
    } else {
      setPasswordError(null);
    }

    if (password !== passwordConf) {
      setPasswordConfError("Passwords don't match.");
      valid = false
    } else {
      setPasswordConfError(null);
    } 

    if (phone.length === 0) {
      setPhoneError("Missing phone number");
      valid = false
    } else if (!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone)) {
      setPhoneError("Incorrect phone format");
      valid = false
    } else {
      setPhoneError(null);
    }

    //added here 
    if (valid) {
      // Prepare the data to send to the backend
      const accountData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        isCoach
      };

      // Make a POST request to the backend registration endpoint
      axios.post(`${baseUrl}/api/users/register`, accountData)
        .then(response => {
          // Handle success
          console.log(response.data.message);
          setSuccessMessage("Account created successfully!");
          let user_id = response.data.ident;
          setTimeout(() => {
            // Navigate to the initial survey or other user-specific page
            navigate('/initial-survey', { state: { isCoach, user_id }});
          }, 1000);
        })
        .catch(error => {
          // Handle errors
          console.error('Registration error:', error.response ? error.response.data : error.message);
          setGeneralError(error.response ? error.response.data.message : error.message);
        });
    }
  }//end here

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <h1>Create Account</h1>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <TextField id="inpFirstName" label="First Name" variant="filled" error={Boolean(firstNameError)} helperText={firstNameError || ' '} required value={firstName} onChange={(event) => {
                setFirstName(event.target.value);
              }}/>
            </Grid>
            <Grid item>
              <TextField id="inpLastName" label="Last Name" variant="filled" error={Boolean(lastNameError)} helperText={lastNameError || ' '} required value={lastName} onChange={(event) => {
                setLastName(event.target.value);
              }}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField sx={{ width: '398px' }}id="inpEmail" label="Email" variant="filled" error={Boolean(emailError)} helperText={emailError || ' '} required value={email} onChange={(event) => {
            setEmail(event.target.value);
          }}/>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <TextField id="inpPassword" label="Password" variant="filled" error={Boolean(passwordError)} helperText={passwordError || ' '} required type="password" value={password} onChange={(event) => {
                setPassword(event.target.value);
              }}/>
            </Grid>
            <Grid item>
              <TextField id="inpPasswordConf" label="Confirm Password" variant="filled" error={Boolean(passwordConfError)} helperText={passwordConfError || ' '} required type="password" value={passwordConf} onChange={(event) => {
                setPasswordConf(event.target.value);
              }}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField sx={{ width: '220px' }}id="inpPhone" label="Phone Number" variant="filled" error={Boolean(phoneError)} helperText={phoneError || ' '} required value={phone} onChange={(event) => {
            setPhone(event.target.value);
          }}/>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={isCoach}
            onChange={(event) => setIsCoach(event.target.value)}
            select
            sx={{width: "150px"}}
            label="I am primarily a..."
            title='user-type'
          >
            <MenuItem value={false}>
              Client
            </MenuItem>
            <MenuItem value={true}>
              Coach
            </MenuItem>
          </TextField>
        </Grid>
        {/* added here */}
        <Grid item xs={12}>
          {generalError && <Typography color="error">{generalError}</Typography>}
        </Grid>
        {/* ends here */}
        <Grid item xs={12}>
          <Button id="createAccountBtn" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
            createAccount();
          }}>
            Create Account
          </Button>
        </Grid>
      </Grid>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </Box>
  )

}

export default CreateAccountPage