import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, Typography, TextField, Select, MenuItem, Button, Alert } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
export default function InitialSurvey () {

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [fitnessGoalError, setFitnessGoalError] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  function submit () {
    
    if (dateOfBirth.length === 0) {
      setDateOfBirthError("Missing date of birth");
    } else {
      setDateOfBirthError(null);
    }

    if (gender.length === 0) {
      setGenderError("Select a value");
    } else {
      setGenderError(null);
    }
    
    if (height.length === 0) {
      setHeightError("Missing height.");
    } else if (!/^[1-9]'([0-9]|1[01])''$/.test(height)) {
      setHeightError("Incorrect Height format.");
    } else {
      setHeightError(null);
    }

    if (weight.length === 0) {
      setWeightError("Missing weight.");
    } else if (weight.length > 3) {
      setWeightError("Weight too long.");
    } else if (!/^[1-9][0-9]*$/.test(weight)) {
      setWeightError("Incorrect weight format.");
    } else {
      setWeightError(null);
    }

    if (fitnessGoal.length === 0) {
      setFitnessGoalError("Missing goal.");
    } else if (fitnessGoal.length > 1000) {
      setFitnessGoalError("Maximum 1000 characters");
    }  else {
      setFitnessGoalError(null);
    }

    // trigger call to the backend
    try {
      axios.post('/api/users/surveys', {
        dateOfBirth: dateOfBirth,
        gender: gender,
        height: height,
        weight: weight,
        fitnessGoal: fitnessGoal,
      }).then((response) => {
        if (response.status === 200) {
          setErrorMessage(null);
          setSuccessMessage("Survey submitted successfully");
        } else {
          if (response.status === 400) {
            setErrorMessage("Invalid input data");
          } else if (response.status === 500) {
            setErrorMessage("Server error");
          } else {
            setErrorMessage("An unexpected error occurred");
          }
        }
      }).catch((error) => {
        console.error('Survey submission error:', error);
        setErrorMessage("An unexpected error occurred");
      });
    } catch (error) {
      console.error('Survey submission error:', error);
      setErrorMessage("An unexpected error occurred");
    }
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>InitialSurvey</Typography>
        <h4>
          Date of Birth
        </h4>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            onChange={(dateOfBirth) => setDateOfBirth(dateOfBirth)}
          />
        </LocalizationProvider>
        
        <h4>
          Gender
        </h4>
          <TextField
            required value={gender}
            onChange={(event) => setGender(event.target.value)}
            select
            sx={{width: "150px"}}
            label="Select One"
            helperText={genderError}
            error={genderError}
          >
            <MenuItem value={"male"}>
              Male
            </MenuItem>
            <MenuItem value={"female"}>
              Female
            </MenuItem>
            <MenuItem value={"non-binary"}>
              Non-Binary
            </MenuItem>
            <MenuItem value={"other"}>
              Other
            </MenuItem>
            <MenuItem value={"no-answer"}>
              Prefer not to say
            </MenuItem>
          </TextField>
          
          
        <h4>
          Height (ft'in'')
        </h4>
      <TextField id="inpHeight" variant="filled" error={heightError} helperText={heightError} required value={height} onChange={(event) => {
        setHeight(event.target.value);
      }}/>
          <h4>
            Weight (lbs)
          </h4>
          <TextField id="inpWeight" variant="filled" error={weightError} helperText={weightError} required value={weight} onChange={(event) => {
            setWeight(event.target.value);
          }}/>
            <h4>
              Fitness Goal
            </h4>
          <TextField id="inpFitnessGoal" variant="filled" error={fitnessGoalError} helperText={fitnessGoalError} required value={fitnessGoal} onChange={(event) => {
            setFitnessGoal(event.target.value);
          }}/>
        <br/>
        <br/>
      <Button id="submitBtn" variant="contained" onClick={() => {
        submit();
      }}>
        Submit
      </Button>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </Box>
  )

}