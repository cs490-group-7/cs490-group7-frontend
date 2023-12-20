import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutListMenu (props) {

    const location = useLocation();

    const { client } = location.state || {  user_id: false, client: false };
    const user_id = parseInt(localStorage.getItem('userId'));

    const [workoutList, setWorkoutList] = useState();
    const [selectedWorkout, setSelectedWorkout] = useState();

    useEffect(() => {

        getWorkouts();

    }, [props]);

    function getWorkouts () {

        axios.post(`${baseUrl}/api/workout/workout-list`, {userId: client ? client.client_id : user_id})
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
            <Button className="blue-button" id="createWorkoutBtn" variant="contained" title="createWorkoutBtn" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
                props.createFunc();
            }}>Create Workout</Button>

            <Grid container spacing={0.5} padding={0.5}>

                {(typeof workoutList !== 'undefined') && workoutList.map((workout, i) => {
                    return <Grid item key={"workout" + i.toString()} xs={12} sx={{ width: 1 }}>
                        <Card variant="outlined" sx={{ margin: 0.5, padding: 0.5, border: 3, borderRadius: 2, borderColor: selectedWorkout === workout.workout_id ? '#00008b' : '#E8E8F5', backgroundColor: '#E8E8F5', color: "#00008b" }}>
                            <div style={{ fontSize: '18px', padding: 3 }}><b>{workout.workout_name}</b></div>
                            {!workout.yours ? <div style={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}><i>Created by Coach</i></div> : ""}
                            <div><i>{workout.description}</i></div>
                            <Button id="viewDetailsBtn" variant="contained" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
                                setSelectedWorkout(null);
                                props.selectFunc(null);
                                props.viewFunc(workout.workout_id);
                            }}>View Details</Button>
                            <Button id="assignBtn" variant="contained" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
                                if (selectedWorkout === workout.workout_id) {
                                    setSelectedWorkout(null);
                                    props.selectFunc(null);
                                } else {
                                    setSelectedWorkout(workout.workout_id);
                                    props.selectFunc(workout.workout_id);
                                }
                            }}>Select</Button>
                            <Button id="editBtn" variant="contained" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
                                setSelectedWorkout(null);
                                props.selectFunc(null);
                                props.editFunc(workout.workout_id);
                            }}>Edit</Button>
                            <Button id="deleteBtn" variant="contained" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#8C0044", color: "#ffffff", '&:hover': { backgroundColor: "#A94073" } }} onClick={() => {
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