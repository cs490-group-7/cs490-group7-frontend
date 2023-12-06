import React, { useEffect, useState } from 'react'
import { Typography, Button, Card, Grid, TextField, FormControl, Alert, MenuItem, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function LogSessionMenu (props) {

    const location = useLocation();

    const { user_id } = location.state || { user_id: false };
    
    const [workoutName, setWorkoutName] = useState("");
    const [setCount, setSetCount] = useState(0);
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
                setSetCount(response.data.workout.set_count);
                setDescription(response.data.workout.description);
                var tempExercises = [];
                response.data.exercises.map((exercise, i) => {
                    tempExercises.push({exercise_id: exercise.exercise_id, exercise_name: exercise.exercise_name, total: 0, rep_count: exercise.reps, exercise_error: "", rep_error: ""})
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
          
            if (exercise.total % 1 !== 0) {
                exercise.rep_error = "Total count must be an integer.";
                valid = false
            } else if (exercise.total < 0) {
                exercise.rep_error = "Total count must be positive.";
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
                dayOfWeek: props.selectedDate.getDay()
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

            <Button id="backBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
              props.backFunc();
            }}>{"<"} Back</Button>

            <div>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{workoutName}</Typography>
                <div>
                    <b>{props.selectedDate.toLocaleDateString('en-us', { weekday: "long" })}, {props.selectedDate.toLocaleDateString('en-us', { month: "long", day: "numeric" })}</b>
                </div>
                <div><i>{description}</i></div>
                <div>Set Count: {setCount}</div>
            </div>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Exercises</Typography>

            <Grid container spacing={1} padding={1}>

                {exercises.map((exercise, i) => {
                    console.log(exercise);
                    return <Grid container item xs={12} spacing={0.5}>
                        <Grid item xs={6}>
                            <div><b>{exercise.exercise_name}</b></div>
                        </Grid>
                        <Grid item xs={3} align="right" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <TextField id={"repCount" + (i+1).toString()} label="Rep Total" variant="outlined" required error={Boolean(exercise.rep_error)} helperText={exercise.rep_error || ' '} type="number" value={exercise.total} onChange={(event) => {
                                exercise.total = event.target.value;
                                const newList = [...exercises];
                                setExercises(newList);
                            }}/>
                        </Grid>
                        <Grid item xs={3} style={{ display: "flex", alignItems: "flex-start" }}>
                            <div><i> / {setCount * exercise.rep_count} total reps</i></div>
                        </Grid>
                    </Grid>
                })}

            </Grid>

    <Button id="saveSessionBtn" variant="contained" onClick={() => {
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