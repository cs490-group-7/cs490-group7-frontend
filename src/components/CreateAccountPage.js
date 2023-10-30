import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, Typography, TextField, Select, MenuItem, Button } from '@mui/material'

function CreateAccountPage () {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [isCoach, setIsCoach] = useState(false);

  function createAccount () {
    // trigger call to the backend
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Account</Typography>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <TextField id="inpFirstName" label="First Name" variant="filled" required value={firstName} onChange={(event) => {
                setFirstName(event.target.value);
              }}/>
            </Grid>
            <Grid item>
              <TextField id="inpLastName" label="Last Name" variant="filled" required value={lastName} onChange={(event) => {
                setLastName(event.target.value);
              }}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField id="inpEmail" label="Email" variant="filled" required value={email} onChange={(event) => {
            setEmail(event.target.value);
          }}/>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <TextField id="inpPassword" label="Password" variant="filled" required type="password" value={password} onChange={(event) => {
                setPassword(event.target.value);
              }}/>
            </Grid>
            <Grid item>
              <TextField id="inpPasswordConf" label="Confirm Password" variant="filled" required type="password" value={passwordConf} onChange={(event) => {
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
            sx={{width: "150px"}}
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
      </Grid>
    </Box>
  )

}

export default CreateAccountPage