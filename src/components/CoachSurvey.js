import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, Typography, TextField, Select, MenuItem, Button, Alert, AlertTitle } from '@mui/material'
import axios from 'axios';

export default function CoachSurvey () {

  const [certifications, setCertifications] = useState("");
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState("");


  const [certificationsError, setCertificationsError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [specializationsError, setSpecializationsError] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  function submit () {
    
    if (certifications.length === 0) {
        setCertificationsError("Please enter certifications");
    } else if (certifications.length > 1000) {
        setCertificationsError("Maximum 1000 characters");
    } else {
        setCertificationsError(null);
    }


    if (experience.length === 0) {
        setExperienceError("Please enter experience");
    } else if (experience.length > 1000) {
        setExperienceError("Maximum 1000 characters");
    } else {
        setExperienceError(null);
    }

    if (specializations.length === 0) {
        setSpecializationsError("Please enter specializations");
    } else if (specializations.length > 1000) {
        setSpecializationsError("Maximum 1000 characters");
    } else {
        setSpecializationsError(null);
    }

    // trigger call to the backend
    if(certificationsError == null && experienceError == null && specializationsError == null){
        axios.post('/api/surveysCO/initial-survey', { certifications, experience, specializations})
        .then((res) => {
          if (res.status === 200) {
            // Successful Survey creation
            setErrorMessage(null);
            setSuccessMessage(res.data.message);
          } else if (res.status === 400) {
           // Database fail
           setErrorMessage(res.data.message);
           setSuccessMessage(null);
          }
        })
        .catch((err) => {
         // Server error
         setErrorMessage("Server error");
         console.error(err);
       });
    }
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        CoachSurvey
      </Typography>
      <h4>Certifications</h4>
      <TextField
        id="inpCertifications"
        variant="filled"
        error={Boolean(certificationsError)}
        helperText={certificationsError}
        required
        value={certifications}
        onChange={(event) => {
          setCertifications(event.target.value);
        }}
      />
      <h4>Experience</h4>
      <TextField
        id="inpExperience"
        variant="filled"
        error={Boolean(experienceError)}
        helperText={experienceError}
        required
        value={experience}
        onChange={(event) => {
          setExperience(event.target.value);
        }}
      />
      <h4>Specializations</h4>
      <TextField
        id="inpSpecializations"
        variant="filled"
        error={Boolean(specializationsError)}
        helperText={specializationsError}
        required
        value={specializations}
        onChange={(event) => {
          setSpecializations(event.target.value);
        }}
      />
      <br />
      <br />
      <Button
        id="submitBtn"
        variant="contained"
        onClick={submit}
      >
        Submit
      </Button>
      {successMessage && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );

}