import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutListMenu (props) {

    const location = useLocation();

    const { user_id } = location.state || { user_id: false };

    const [workoutList, setWorkoutList] = useState();
    const [selectedWorkout, setSelectedWorkout] = useState();

    useEffect(() => {

        getWorkouts();

    }, []);

    function getWorkouts () {

        axios.post(`${baseUrl}/api/workout/workout-list`, {userId: user_id})
            .then((response) => {
                setWorkoutList(response.data);
            })
            .catch((error) => {
                console.error('Error fetching workout list:', error);
            });

    }

    function deleteWorkout (workoutId) {

        axios.post(`${baseUrl}/api/workout/delete-workout`, {workoutId})
            .catch((error) => {
                console.error('Error fetching workout list:', error);
            });
        window.location.reload()
        getWorkouts();

    }

    return (
        <div className="workout-list-menu">

            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>List of Workouts</Typography>
            <Button id="createWorkoutBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                props.createFunc();
            }}>Create Workout</Button>

            <Grid container spacing={0.5} padding={0.5}>

                {(typeof workoutList !== 'undefined') && workoutList.map((workout) => {
                    return <Grid item xs={12} sx={{ width: 1 }}>
                        <Card variant="outlined" sx={{ padding: 1, borderColor: selectedWorkout === workout.workout_id ? '#00008b' : '#d9d9d9' }}>
                            <div><b>{workout.workout_name}</b></div>
                            <div><i>{workout.description}</i></div>
                            <Button id="viewDetailsBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                setSelectedWorkout(null);
                                props.selectFunc(null);
                                props.viewFunc(workout.workout_id);
                            }}>View Details</Button>
                            <Button id="assignBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                if (selectedWorkout === workout.workout_id) {
                                    setSelectedWorkout(null);
                                    props.selectFunc(null);
                                } else {
                                    setSelectedWorkout(workout.workout_id);
                                    props.selectFunc(workout.workout_id);
                                }
                            }}>Select</Button>
                            <Button id="editBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                setSelectedWorkout(null);
                                props.selectFunc(null);
                                props.editFunc(workout.workout_id);
                            }}>Edit</Button>
                            <Button id="deleteBtn" variant="contained" color="error" sx={{ margin: 1 }} onClick={() => {
                                setSelectedWorkout(null);
                                props.selectFunc(null);
                                deleteWorkout(workout.workout_id);
                            }}>Delete</Button>
                        </Card>
                    </Grid>
                })}

            </Grid>

        </div>
    )

}

export default WorkoutListMenu;