import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutListMenu (props) {

    const [workoutList, setWorkoutList] = useState();

    useEffect(() => {

        axios.get(`${baseUrl}/api/workout/workout-list`)
            .then((response) => {
                setWorkoutList(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching workout list:', error);
            });

    }, []);

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
                        </Card>
                    </Grid>
                })}

            </Grid>

        </div>
    )

}

export default WorkoutListMenu;