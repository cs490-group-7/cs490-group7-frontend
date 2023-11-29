import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutListMenu (props) {

    const location = useLocation();

    const { user_id } = location.state || { user_id: false };

    const [workoutList, setWorkoutList] = useState();

    useEffect(() => {

        getWorkouts();

    }, []);

    function getWorkouts () {

        axios.post(`${baseUrl}/api/workout/workout-list`, {userId: user_id})
            .then((response) => {
                setWorkoutList(response.data);
                console.log(response.data);
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
                    return <Grid item xs={12} spacing={0.5} sx={{ width: 1 }}>
                        <Card variant="outlined" sx={{ padding: 1 }}>
                            <div><b>{workout.workout_name}</b></div>
                            <div><i>{workout.description}</i></div>
                            <Button id="viewDetailsBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                props.viewFunc(workout.workout_id);
                            }}>View Details</Button>
                            <Button id="editBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                props.editFunc(workout.workout_id);
                            }}>Edit</Button>
                            <Button id="deleteBtn" variant="contained" color="error" sx={{ margin: 1 }} onClick={() => {
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