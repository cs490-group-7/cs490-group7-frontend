import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function CoachSurvey() {
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [availability, setAvailability] = useState("");

  const [experienceError, setExperienceError] = useState("");
  const [specializationsError, setSpecializationsError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state.user_id;

  const [errorMessage, setErrorMessage] = useState(null);

  // Replace this with your actual state choices
  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const submit = () => {
    let valid = true;

    if (experience.length === 0) {
      setExperienceError("Please enter experience");
      valid = false;
    } else if (experience.length > 1000) {
      setExperienceError("Maximum 1000 characters");
      valid = false;
    } else {
      setExperienceError(null);
    }

    if (specializations.length === 0) {
      setSpecializationsError("Please enter specializations");
      valid = false;
    } else if (specializations.length > 1000) {
      setSpecializationsError("Maximum 1000 characters");
      valid = false;
    } else {
      setSpecializationsError(null);
    }

    if (city.length === 0) {
      setCityError("Please enter city");
      valid = false;
    } else if (city.length > 100) {
      setCityError("Maximum 100 characters");
      valid = false;
    } else {
      setCityError(null);
    }

    if (state.length === 0) {
      setStateError("Please select a state");
      valid = false;
    } else {
      setStateError(null);
    }

    if (availability.length === 0) {
      setAvailabilityError("Please enter availability");
      valid = false;
    } else if (availability.length > 1000) {
      setAvailabilityError("Maximum 1000 characters");
      valid = false;
    } else {
      setAvailabilityError(null);
    }

    if (valid) {
      const surveyData = {
        user_id,
        experience,
        specializations,
        city,
        state,
        availability,
      };

      axios.post(`${baseUrl}/api/surveys/coach-survey`, surveyData)
        .then(response => {
          console.log('Coach survey submitted:', response.data);
          navigate('/login');
        })
        .catch(error => {
          console.error('Coach survey submission error:', error.response ? error.response.data : error.message);
          setErrorMessage('Coach survey submission error:', error.response ? error.response.data : error.message);
        });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Coach Survey</Typography>
      <br></br>
      <TextField
        id="inpExperience"
        variant="filled"
        label="Experience"
        error={Boolean(experienceError)}
        helperText={experienceError || ' '}
        required
        value={experience}
        sx={{ width: '500px'}}
        onChange={(event) => setExperience(event.target.value)}
      />
      <br></br>
      <TextField
        id="inpSpecializations"
        variant="filled"
        label="Specializations"
        error={Boolean(specializationsError)}
        helperText={specializationsError || ' '}
        required
        value={specializations}
        sx={{ width: '500px'}}
        onChange={(event) => setSpecializations(event.target.value)}
      />
      <br></br>
      <TextField
        id="inpAvailability"
        variant="filled"
        label="Availability"
        error={Boolean(availabilityError)}
        helperText={availabilityError || ' '}
        required
        value={availability}
        sx={{ width: '500px'}}
        onChange={(event) => setAvailability(event.target.value)}
      />
      <br></br>
      <TextField
        id="inpCity"
        variant="filled"
        label="City"
        error={Boolean(cityError)}
        helperText={cityError || ' '}
        required
        value={city}
        sx={{ width: '200px'}}
        onChange={(event) => setCity(event.target.value)}
      />
      <FormControl fullWidth variant="filled" error={Boolean(stateError)} required>
        <InputLabel id="state-select-label">State</InputLabel>
        <Select
          labelId="state-select-label"
          id="inpState"
          value={state}
          onChange={(event) => setState(event.target.value)}
          sx={{ width: '200px'}}
        >
          {stateOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      <br />
      <br />

      <Button id="submitBtn" variant="contained" onClick={submit}>
        Submit
      </Button>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}
