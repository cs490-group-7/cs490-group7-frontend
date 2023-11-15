import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function CoachSurvey () {

  const [certifications, setCertifications] = useState("");
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState("");

  const [certificationsError, setCertificationsError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [specializationsError, setSpecializationsError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state.user_id;

  const [errorMessage, setErrorMessage] = useState(null);

  function submit () {
    let valid = true;

    if (certifications.length === 0) {
        setCertificationsError("Please enter certifications");
        valid = false;
    } else if (certifications.length > 1000) {
        setCertificationsError("Maximum 1000 characters");
        valid = false;
    } else {
        setCertificationsError(null);
    }


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

    // trigger call to the backend added here
    
    if (valid) {
        const surveyData = {
          user_id,
          certifications,
          experience,
          specializations
        };
  
        axios.post('http://localhost:4000/api/surveys/coach-survey', surveyData)
          .then(response => {
            console.log('Coach survey submitted:', response.data);
            navigate('/login');
          })
          .catch(error => {
            console.error('Coach survey submission error:', error.response ? error.response.data : error.message);
            setErrorMessage('Coach survey submission error:', error.response ? error.response.data : error.message);
          });
      }
    } //ends here

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>CoachSurvey</Typography>
        <h4>
            Certifications
        </h4>
        <TextField id="inpCertifications" variant="filled" error={Boolean(certificationsError)} helperText={certificationsError || ' '} required value={certifications} onChange={(event) => {
        setCertifications(event.target.value);
        }}/>
        <h4>
            Experience
        </h4>
        <TextField id="inpExperience" variant="filled" error={Boolean(experienceError)} helperText={experienceError || ' '} required value={experience} onChange={(event) => {
        setExperience(event.target.value);
        }}/>
        <h4>
            Specializations
        </h4>
        <TextField id="inpSpecializations" variant="filled" error={Boolean(specializationsError)} helperText={specializationsError || ' '} required value={specializations} onChange={(event) => {
        setSpecializations(event.target.value);
        }}/>
        <br/>
        <br/>
        <Button id="submitBtn" variant="contained" onClick={() => {
        submit();
        }}>
        Submit
        </Button>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  )

}