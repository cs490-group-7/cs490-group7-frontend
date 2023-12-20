import React, { useEffect, useState } from 'react'
import { Typography, Button, Card, Grid, TextField, FormControl, Alert, MenuItem, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function LogSessionMenu (props) {

    const user_id = localStorage.getItem('userId');
    
    const [workoutName, setWorkoutName] = useState("");
    const [description, setDescription] = useState("");

    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);

    const [exercises, setExercises] = useState([]);

    useEffect(() => {

        const workoutIdData = {
            workoutId: props.workoutId
        };

        axios.post(`${baseUrl}/api/workout/workout-details`, workoutIdData)
            .then((response) => {
                setWorkoutName(response.data.workout.workout_name);
                setDescription(response.data.workout.description);
                var tempExercises = [];
                response.data.exercises.map((exercise, i) => {
                    tempExercises.push({exercise_id: exercise.exercise_id, exercise_name: exercise.exercise_name, set_total: 0, rep_total: 0, set_count: exercise.set_count, rep_count: exercise.reps, exercise_error: "", set_error: "", rep_error: ""})
                });
                setExercises(tempExercises);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching workout details:', error);
            });

    }, [props]);

    function saveSession () {

        let valid = true;

        if (!user_id) {
          setErrorMessage("Not logged in.");
          valid = false
        }

        exercises.map((exercise, i) => {
          
            if (exercise.set_total % 1 !== 0) {
                exercise.set_error = "Set total count must be an integer.";
                valid = false
            } else if (exercise.set_total < 0) {
                exercise.set_error = "Set total count must be positive.";
                valid = false
            } else {
                exercise.set_error = null;
            }

            if (exercise.rep_total % 1 !== 0) {
                exercise.rep_error = "Rep total count must be an integer.";
                valid = false
            } else if (exercise.rep_total < 0) {
                exercise.rep_error = "Rep total count must be positive.";
                valid = false
            } else {
                exercise.rep_error = null;
            }

        })

        const newList = [...exercises];
        setExercises(newList);

        if (valid) {
            const loggingData = {
                userId: user_id,
                workoutId: props.workoutId,
                sessionDate: props.selectedDate.toISOString().split('T')[0],
                dayOfWeek: props.selectedDate.getDay(),
                exercises: exercises
            }
          
            axios.post(`${baseUrl}/api/workout/log-session`, loggingData)
                .then(response => {
                    console.log('Session logged: ', response.data);
                })
                .catch(error => {
                    setErrorMessage('Session logging error:', error.response ? error.response.data : error.message);
                });
            props.backFunc();
        }
    }

    return (
        <div className="log-session-menu">

            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Log Session</Typography>

            <Button id="backBtn" variant="contained" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
              props.backFunc();
            }}>{"<"} Back</Button>

            <div>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{workoutName}</Typography>
                <div>
                    <b>{props.selectedDate.toLocaleDateString('en-us', { weekday: "long" })}, {props.selectedDate.toLocaleDateString('en-us', { month: "long", day: "numeric" })}</b>
                </div>
                <div><i>{description}</i></div>
            </div>

            <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>Exercises</Typography>

            <Grid container spacing={1} padding={1}>

                {exercises.map((exercise, i) => {
                    return <Grid container item xs={12} spacing={0.5}>
                        <Grid item xs={4}>
                            <div style={{ fontSize: '18px'}}><b>{exercise.exercise_name}:</b></div>
                        </Grid>
                        <Grid item xs={2} align="right" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <TextField id={"setCount" + (i+1).toString()} label="Set Total" variant="outlined" required error={Boolean(exercise.set_error)} helperText={exercise.set_error || ' '} type="number" value={exercise.set_total} onChange={(event) => {
                                exercise.set_total = event.target.value;
                                const newList = [...exercises];
                                setExercises(newList);
                            }}/>
                        </Grid>
                        <Grid item xs={2} style={{ display: "flex", alignItems: "flex-start" }}>
                            <div><i> / {exercise.set_count} total sets</i></div>
                        </Grid>
                        <Grid item xs={2} align="right" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <TextField id={"repCount" + (i+1).toString()} label="Rep Total" variant="outlined" required error={Boolean(exercise.rep_error)} helperText={exercise.rep_error || ' '} type="number" value={exercise.rep_total} onChange={(event) => {
                                exercise.rep_total = event.target.value;
                                const newList = [...exercises];
                                setExercises(newList);
                            }}/>
                        </Grid>
                        <Grid item xs={2} style={{ display: "flex", alignItems: "flex-start" }}>
                            <div><i> / {exercise.rep_count} total reps</i></div>
                        </Grid>
                    </Grid>
                })}

            </Grid>

    <Button id="saveSessionBtn" variant="contained" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
        saveSession();
    }}>Log Session</Button>
    <div style={{ width: '50%'}}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </div>

        </div>
    )

}

export default LogSessionMenu;