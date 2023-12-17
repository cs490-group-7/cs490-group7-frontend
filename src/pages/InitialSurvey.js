import React, { useState } from 'react'
import { Box, Typography, TextField, MenuItem, Button, Alert } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function InitialSurvey () {

  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState("");
  const [weightGoalValue, setWeightGoalValue] = useState("");

  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [weightGoalError, setWeightGoalError] = useState("");
  const [weightGoalValueError, setWeightGoalValueError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state.user_id
  const { isCoach } = location.state || { isCoach: false };

  const [errorMessage, setErrorMessage] = useState(null);

  function submit () {
    let valid = true;
    console.log(dateOfBirth)
    if (!dateOfBirth || !dateOfBirth.isValid()) {
      setDateOfBirthError("Missing date of birth");
      valid = false
    } else {
      setDateOfBirthError("");
    }

    if (gender.length === 0) {
      setGenderError("Select a value");
      valid = false
    } else {
      setGenderError(null);
    }
    
    if (height.length === 0) {
      setHeightError("Missing height.");
      valid = false
    } else if (!/^[1-9]'([0-9]|1[01])''$/.test(height)) {
      setHeightError("Incorrect Height format.");
      valid = false
    } else {
      setHeightError(null);
    }

    if (weight.length === 0) {
      setWeightError("Missing weight.");
      valid = false
    } else if (!/^[1-9][0-9]*$/.test(weight)) {
      setWeightError("Incorrect weight format.");
      valid = false
    } else if (weight.length > 3) {
      setWeightError("Weight too long.");
      valid = false
    } else {
      setWeightError(null);
    }

    if (weightGoal.length === 0) {
      setWeightGoalError("Missing weight goal.");
      valid = false
    } else {
      setWeightGoalError(null);
    }

    if ((weightGoal === "Gain" || weightGoal === "Lose") && weightGoalValue.length === 0) {
      setWeightGoalValueError("Missing weight goal value.");
      valid = false
    } else if (weightGoal === "Maintain") {
      setWeightGoalValue(weight);
      setWeightGoalValueError(null);
    } else if (!/^[1-9][0-9]*$/.test(weightGoalValue)) {
      setWeightGoalValueError("Incorrect weight format.");
      valid = false;
    } else if (weightGoalValue.length > 3) {
      setWeightError("Weight too long.");
      valid = false
    } else {
      setWeightGoalValueError(null);
    }

  // trigger call to the backend added here
        
        if (valid) {
          const isoDate = dateOfBirth ? dateOfBirth.toISOString() : '';
          const date_of_birth = isoDate.split('T')[0];
          const surveyData = {
            user_id,
            date_of_birth,
            gender,
            height,
            weight,
            weightGoal,
            weightGoalValue
          };
    
          // Determine the endpoint based on whether the user is a coach or not
          axios.post(`${baseUrl}/api/surveys/initial-survey`, surveyData)
            .then(response => {
              console.log('Survey submitted:', response.data);
              if (isCoach) {
                navigate('/coach-survey', { state: { isCoach, user_id }});
              } else {
                navigate('/login');
              }
            })
            .catch(error => {
              console.error('Survey submission error:', error.response ? error.response.data : error.message);
              setErrorMessage(error.response ? error.response.data.message : error.message);
            });
        }
      } //ends here
    
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <h1>Initial Survey</h1>
        <h4 style={{ marginBottom: '10px', marginTop: '0px'}}>
          Date of Birth
        </h4>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={dateOfBirth}
            onChange={(newDate) => setDateOfBirth(newDate)}
            componentsProps={{
              textField: {
                error: dateOfBirthError !== "",
                helperText: dateOfBirthError || ' ',
                variant: "filled",
              }
            }}
          />
        </LocalizationProvider>
        
        <h4 style={{ marginBottom: '10px', marginTop: '0px'}}>
          Gender
        </h4>
          <TextField
            required value={gender}
            onChange={(event) => setGender(event.target.value)}
            select
            sx={{width: "150px"}}
            label="Select One"
            helperText={genderError || ' '}
            error={Boolean(genderError)}
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
          
          
        <h4 style={{ marginBottom: '10px', marginTop: '0px'}}>
          Height (ft'in'')
        </h4>
      <TextField id="inpHeight" variant="filled" error={Boolean(heightError)} helperText={heightError || ' '} required value={height} onChange={(event) => {
        setHeight(event.target.value);
      }}/>
          <h4 style={{ marginBottom: '10px', marginTop: '0px'}}>
            Weight (lbs)
          </h4>
          <TextField id="inpWeight" variant="filled" error={Boolean(weightError)} helperText={weightError || ' '} required value={weight} onChange={(event) => {
            setWeight(event.target.value);
          }}/>

      <h4 style={{ marginBottom: '20px', marginTop: '0px'}}>
        Weight Goal
      </h4>
      <TextField
        required value={weightGoal}
        onChange={(event) => {
          setWeightGoal(event.target.value);
          if (event.target.value === "Maintain") {
            setWeightGoalValue(weight);
          }
        }}
        select
        sx={{width: "150px"}}
        label="Select One"
        helperText={weightGoalError || ' '}
        error={Boolean(weightGoalError)}
      >
        <MenuItem value={"Gain"}>
          Gain
        </MenuItem>
        <MenuItem value={"Lose"}>
          Lose
        </MenuItem>
        <MenuItem value={"Maintain"}>
          Maintain
        </MenuItem>
      </TextField>

      { (weightGoal === "Gain" || weightGoal === "Lose") && 
        <div>
          <h4 style={{ marginBottom: '10px', marginTop: '0px'}}>
            Weight Goal Value (lbs)
          </h4>
          <TextField id="inpWeightGoalValue" variant="filled" error={Boolean(weightGoalValueError)} helperText={weightGoalValueError || ' '} required value={weightGoalValue} onChange={(event) => {
            setWeightGoalValue(event.target.value);
          }}/>
        </div>
      }
      <br></br>
      <Button id="submitBtn" variant="contained" onClick={submit}>
        Submit
      </Button>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Box>
    )
}