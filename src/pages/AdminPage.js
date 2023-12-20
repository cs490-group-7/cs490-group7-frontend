import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Button, MenuItem, Select, Card, CardContent, TextField, Alert, FormControl, InputLabel } from '@mui/material';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const resultsPerPage = 8;

export default function AdminPage() {
    const [pendingCoaches, setPendingCoaches] = useState([]);
    const [exerciseBank, setExerciseBank] = useState([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseType, setNewExerciseType] = useState('');
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);
    const [inputErrors, setInputErrors] = useState({name: '', type: ''});
    const [hasError, setHasError] = useState({name: false, type: false});

    useEffect(() => {
        fetchPendingCoaches();
        fetchExerciseBank();
    }, []);

    const fetchPendingCoaches = () => {
        axios.get(`${baseUrl}/api/users/pending-coaches`)
            .then(response => {
                setPendingCoaches(response.data);
            })
            .catch(error => {
                console.error('Error fetching pending coaches:', error);
            });
    };

    const fetchExerciseBank = () => {
        axios.get(`${baseUrl}/api/users/exercise-bank`)
            .then(response => {
                setExerciseBank(response.data);
            })
            .catch(error => {
                console.error('Error fetching exercise bank data:', error);
            });
    };

    const handleApproval = (coachId, isApproved) => {
        axios.post(`${baseUrl}/api/users/update-coach-approval`, { coachId, isApproved })
            .then(() => {
                setPendingCoaches(pendingCoaches.filter(coach => coach.id !== coachId));
            })
            .catch(error => {
                console.error('Error updating coach approval:', error);
            });
    };

    const handleAddExercise = () => {
        console.log(newExerciseType)
        if(newExerciseName === ""){
            setInputErrors({...inputErrors, name: 'Required'});
            setHasError({...hasError, name: true})
            return;
        }
        else if(newExerciseType === ""){
            setInputErrors({...inputErrors, type: 'Required'});
            setHasError({...hasError, type: true})
            return;
        }
        axios.post(`${baseUrl}/api/users/add-exercise`, { exercise_name: newExerciseName, exercise_type: newExerciseType })
            .then(response => {
                setErrorMessage(null);
                setSuccessMessage(response.data.message);
                fetchExerciseBank();
            })
            .catch(error => {
                setSuccessMessage(null);
                setErrorMessage(error.response.data ? error.response.data.message : 'Error reaching server');
            });
    };

    const handleDeleteExercise = (exerciseId) => {
        console.log(exerciseId)
        axios.post(`${baseUrl}/api/users/delete-exercise`, { exercise_id: exerciseId })
            .then(() => {
                fetchExerciseBank();
            })
            .catch(error => {
                console.error('Error deleting exercise:', error);
            });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [exerciseTypeFilter, setExerciseTypeFilter] = useState('');
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

    const handleNewExerciseType = (event) => {
        setNewExerciseType(event.target.value);
        setInputErrors({...inputErrors, type: ''})
        setHasError({...hasError, type: false})
    };

    const handleNewExerciseName = (name) => {
        setNewExerciseName(name);
        setInputErrors({...inputErrors, name: ''})
        setHasError({...hasError, name: false})
    };

    return (
        <div className="admin-page" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
                <h1>Coach Approvals</h1>
                {pendingCoaches.length === 0 ? (
                    <p>No pending approvals.</p>
                ) : (
                    pendingCoaches.map(coach => (
                        <Card key={coach.id} variant="outlined" sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h5">{coach.first_name} {coach.last_name}</Typography>
                                <Typography variant="body1">Specializations: {coach.specializations}</Typography>
                                <Typography variant="body1">Experience (Years): {coach.experience}</Typography>
                                <Typography variant="body1">City: {coach.city}</Typography>
                                <Typography variant="body1">State: {coach.state}</Typography>
                                <Typography variant="body1">Price: {coach.price}</Typography>
                                <Button color="primary" onClick={() => handleApproval(coach.id, true)} sx={{ margin: '10px 0 0 5px'}}>Approve</Button>
                                <Button color="secondary" onClick={() => handleApproval(coach.id, false)} sx={{ margin: '10px 0 0 5px'}}>Reject</Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            <div style={{ width: '50%' }}>
                <Grid item xs={6}>
                    <Box  p={1}>
                        <h1>Exercise Bank</h1>
                        <TextField label="Exercise Name" value={newExerciseName} onChange={(e) => handleNewExerciseName(e.target.value)} error={hasError.name} helperText={inputErrors.name}/>
                        <FormControl sx={{ margin: '0 10px 0 10px'}}>
                            <InputLabel>Exercise Type</InputLabel>
                            <Select
                            value={newExerciseType}
                            onChange={handleNewExerciseType}
                            sx={{ width: '200px'}}
                            label="Exercise Type"
                            error={hasError.type}
                            helperText={inputErrors.type}
                            >
                                <MenuItem value=""> </MenuItem>
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
                        </FormControl>
                        <Button onClick={handleAddExercise} sx={{ height: '55px'}}>Add Exercise</Button>
                        <div style={{ width: '60%'}}>
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        </div>
                        <p>    Filter:</p>
                        <FormControl sx={{ margin: '0 10px 0 10px'}}>
                            <InputLabel>Exercise Type</InputLabel>
                            <Select
                            value={exerciseTypeFilter}
                            onChange={handleFilterChange}
                            sx={{ width: '200px'}}
                            label="Exercise Type"
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
                        </FormControl>
                    </Box>

          {/* Exercise Bank Box */}
          <Box  p={2} height="100%">
            {displayedExercises.map((exercise, index) => (
              <Box key={index} borderBottom={1} p={1} borderColor="lightgrey">
                <Button color='error' sx={{ float: 'right', marginRight: '50px'}} onClick={() => handleDeleteExercise(exercise.exercise_id)}>
                    Delete
                </Button>
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
                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                >
                  Previous Page
                </Button>
                <Typography sx={{ marginX: 2 }}>{currentPage}</Typography>
                <Button
                  disabled={filteredExercises.length <= endIdx}
                  onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                >
                  Next Page
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
            </div>
        </div>
    );
}
