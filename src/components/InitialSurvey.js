import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function InitialSurvey() {
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');

  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [fitnessGoalError, setFitnessGoalError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { isCoach } = location.state || { isCoach: false };

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function submit() {
    let valid = true;
    if (dateOfBirth == null) {
      setDateOfBirthError('Missing date of birth');
      valid = false;
    } else {
      setDateOfBirthError(null);
    }

    if (gender.length === 0) {
      setGenderError('Select a value');
      valid = false;
    } else {
      setGenderError(null);
    }

    if (height.length === 0) {
      setHeightError('Missing height.');
      valid = false;
    } else if (!/^[1-9]'([0-9]|1[01])''$/.test(height)) {
      setHeightError('Incorrect Height format.');
      valid = false;
    } else {
      setHeightError(null);
    }

    if (weight.length === 0) {
      setWeightError('Missing weight.');
      valid = false;
    } else if (weight.length > 3) {
      setWeightError('Weight too long.');
      valid = false;
    } else if (!/^[1-9][0-9]*$/.test(weight)) {
      setWeightError('Incorrect weight format.');
      valid = false;
    } else {
      setWeightError(null);
    }

    if (fitnessGoal.length === 0) {
      setFitnessGoalError('Missing goal.');
      valid = false;
    } else if (fitnessGoal.length > 1000) {
      setFitnessGoalError('Maximum 1000 characters');
      valid = false;
    } else {
      setFitnessGoalError(null);
    }

    // trigger call to the backend
    let serverCheck = false;

    if (
      dateOfBirthError == null &&
      genderError == null &&
      heightError == null &&
      weightError == null &&
      fitnessGoalError == null
    ) {
      try {
        const res = await axios.post('/api/surveys/initial-survey', {
          dateOfBirth,
          gender,
          height,
          weight,
          fitnessGoal,
        });

        if (res.status === 200) {
          // Successful Survey creation
          setErrorMessage(null);
          setSuccessMessage(res.data.message);
          if (isCoach) {
            navigate('/coach-survey');
          } else {
            navigate('/');
          }
        } else if (res.status === 400) {
          // Database fail
          setErrorMessage(res.data.message);
          setSuccessMessage(null);
        }
      } catch (err) {
        // Server error
        setErrorMessage('Server error');
        console.error(err);
      }
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