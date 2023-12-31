import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, MenuItem, Select } from '@mui/material';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const resultsPerPage = 6;

export default function Home() {
  const [exerciseBank, setExerciseBank] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exerciseTypeFilter, setExerciseTypeFilter] = useState('');

  useEffect(() => {
    // Fetch exercise bank data when the component mounts
    fetchExerciseBank();
  }, []);

  const fetchExerciseBank = () => {
    axios.get(`${baseUrl}/api/users/exercise-bank`)
      .then(response => {
        setExerciseBank(response.data);
      })
      .catch(error => {
        console.error('Error fetching exercise bank data:', error);
      });
  };

  const startIdx = (currentPage - 1) * resultsPerPage;
  const endIdx = startIdx + resultsPerPage;

  const filteredExercises = exerciseBank.filter(exercise =>
    exercise.exercise_type.toLowerCase().includes(exerciseTypeFilter.toLowerCase())
  );

  const displayedExercises = filteredExercises.slice(startIdx, endIdx);

  const handleFilterChange = (event) => {
    setExerciseTypeFilter(event.target.value);
    setCurrentPage(1); // Reset to the first page when the filter changes
    // Refetch the exercise bank data with the new filter
    fetchExerciseBank();
  };

  return (
    <div className="home-page">
      <h1>Welcome to TrackMeet!</h1>
      <Grid container spacing={2}>
        {/* Left half of the screen */}
        <Grid item xs={6}>
          {/* Exercise Type Filter Box (Dropdown) */}
          <Box  p={2}>
            <Typography variant="h5">Master over 200 Exercises:</Typography>
            <Typography sx={{ marginTop: '10px'}}>Target a specific muscle group:</Typography>
            <Select
              label="Select Exercise Type"
              value={exerciseTypeFilter}
              onChange={handleFilterChange}
              sx={{ width: '200px'}}
              title='exercise-filter'
            >
              <MenuItem value="">All Muscle Groups</MenuItem>
              <MenuItem value="Chest">Chest</MenuItem>
              <MenuItem value="Shoulder">Shoulder</MenuItem>
              <MenuItem value="Bicep">Bicep</MenuItem>
              <MenuItem value="Tricep">Tricep</MenuItem>
              <MenuItem value="Leg">Leg</MenuItem>
              <MenuItem value="Back">Back</MenuItem>
              <MenuItem value="Glute">Glute</MenuItem>
              <MenuItem value="Ab">Ab</MenuItem>
              <MenuItem value="Forearm Flexors & Grip">Forearm Flexors & Grip</MenuItem>
              <MenuItem value="Forearm Extensor">Forearm Extensor</MenuItem>
              <MenuItem value="Calf">Calf</MenuItem>
            </Select>
          </Box>

          {/* Exercise Bank Box */}
          <Box  p={2} height="100%">
            {displayedExercises.map((exercise, index) => (
              <Box key={index} borderBottom={1} p={1} borderColor="lightgrey">
                <Typography variant="body1" sx={{ color: 'darkblue'}}>{exercise.exercise_name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Type: {exercise.exercise_type}
                </Typography>
                {/* Add more details if needed */}
              </Box>
            ))}
            {filteredExercises.length > resultsPerPage && (
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  disabled={currentPage === 1}
                  sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" }, '&:disabled': { backgroundColor: "#e0e0e0" } }}
                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                >
                  Previous Page
                </Button>
                <Typography sx={{ marginX: 2 }}>{currentPage}</Typography>
                <Button
                  disabled={filteredExercises.length <= endIdx}
                  sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" }, '&:disabled': { backgroundColor: "#e0e0e0" } }}
                  onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                >
                  Next Page
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
