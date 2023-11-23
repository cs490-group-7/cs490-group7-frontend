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
  const [price, setPrice] = useState("");

  const [experienceError, setExperienceError] = useState("");
  const [specializationsError, setSpecializationsError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [priceError, setPriceError] = useState("");

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

    // Validate experience as an integer
    const experienceValue = parseInt(experience, 10);
    if (isNaN(experienceValue) || experienceValue < 0 ) {
      setExperienceError("Please enter a valid positive integer for experience");
      valid = false;
    } else {
      setExperienceError(null);
    }

    if (specializations.length === 0) {
      setSpecializationsError("Please select a specialization");
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

    // Validate price as a float
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      setPriceError("Please enter a valid positive float for price");
      valid = false;
    } else {
      setPriceError(null);
    }

    if (valid) {
      const surveyData = {
        user_id,
        experience: experienceValue,
        specializations,
        city,
        state,
        price: priceValue,
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
      <h1>Coach Survey</h1>
      <TextField
        id="inpExperience"
        variant="filled"
        label="Experience (years)"
        error={Boolean(experienceError)}
        helperText={experienceError || ' '}
        required type = "number"
        value={experience}
        sx={{ width: '500px'}}
        onChange={(event) => setExperience(event.target.value)}
        sx={{ width: '300px'}}
      />
      <FormControl fullWidth variant="filled" error={Boolean(specializationsError)}>
        <InputLabel id="specializations-select-label">Specialization</InputLabel>
        <Select
          labelId="specializations-select-label"
          id="inpSpecializations"
          value={specializations}
          onChange={(event) => setSpecializations(event.target.value)}
          sx={{ width: '300px', marginBottom: '25px'}}
        >
          <MenuItem value="Losing Weight">Losing Weight</MenuItem>
          <MenuItem value="Gaining Weight">Gaining Weight</MenuItem>
          <MenuItem value="Building Muscle">Building Muscle</MenuItem>
          <MenuItem value="Getting Stronger">Getting Stronger</MenuItem>
          <MenuItem value="Getting Faster">Getting Faster</MenuItem>
        </Select>
      </FormControl>

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
        sx={{ width: '300px'}}
      />
      <FormControl fullWidth variant="filled" error={Boolean(stateError)} required>
        <InputLabel id="state-select-label">State</InputLabel>
        <Select
          labelId="state-select-label"
          id="inpState"
          value={state}
          onChange={(event) => setState(event.target.value)}
          sx={{ width: '300px', marginBottom: '25px'}}
        >
          {stateOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="inpPrice"
        variant="filled"
        label="Price per Hour"
        error={Boolean(priceError)}
        helperText={priceError || ' '}
        required type = "number"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        sx={{ width: '300px'}}
      />
      <br />
      <Button id="submitBtn" variant="contained" onClick={submit}>
        Submit
      </Button>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}
