import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, Typography, TextField, Select, MenuItem, Button } from '@mui/material'

function CoachSurvey () {

  const [certifications, setCertifications] = useState("");
  const [experience, setExperience] = useState("");
  const [specializations, setSpecializations] = useState("");


  const [certificationsError, setCertificationsError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [specializationsError, setSpecializationsError] = useState("");


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
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} align="left">
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>CoachSurvey</Typography>
        <h4>
            Certifications
        </h4>
        <TextField id="inpCertifications" variant="filled" error={certificationsError} helperText={certificationsError} required value={certifications} onChange={(event) => {
        setCertifications(event.target.value);
        }}/>
        <h4>
            Experience
        </h4>
        <TextField id="inpExperience" variant="filled" error={experienceError} helperText={experienceError} required value={experience} onChange={(event) => {
        setExperience(event.target.value);
        }}/>
        <h4>
            Specializations
        </h4>
        <TextField id="inpSpecializations" variant="filled" error={specializationsError} helperText={specializationsError} required value={specializations} onChange={(event) => {
        setSpecializations(event.target.value);
        }}/>
        <br/>
        <br/>
        <Button id="submitBtn" variant="contained" onClick={() => {
        submit();
        }}>
        Submit
        </Button>
    </Box>
  )

}

export default CoachSurvey