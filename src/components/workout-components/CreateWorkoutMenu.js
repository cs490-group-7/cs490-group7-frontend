import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, TextField, Select, MenuItem, FormControl, Autocomplete } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function CreateWorkoutMenu (props) {

    const location = useLocation();

    const { user_id } = location.state || { user_id: false };

    const [workoutName, setWorkoutName] = useState("");
    const [setCount, setSetCount] = useState(0);
    const [description, setDescription] = useState("");

    const [workoutNameError, setWorkoutNameError] = useState("");
    const [setCountError, setSetCountError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    const [exercises, setExercises] = useState([
      {exercise_id: 0, rep_count: 0, exercise_error: "", rep_error: ""},
      {exercise_id: 0, rep_count: 0, exercise_error: "", rep_error: ""},
      {exercise_id: 0, rep_count: 0, exercise_error: "", rep_error: ""},
      {exercise_id: 0, rep_count: 0, exercise_error: "", rep_error: ""},
      {exercise_id: 0, rep_count: 0, exercise_error: "", rep_error: ""}
    ]);
    const [exerciseBank, setExerciseBank] = useState();

    useEffect(() => {

        axios.get(`${baseUrl}/api/workout/exercise-bank`)
            .then((response) => {
                setExerciseBank(response.data);
            })
            .catch((error) => {
                console.error('Error fetching exercise bank:', error);
            });

    }, []);

    function createWorkout () {

        let valid = true;

        if (!user_id) {
          setWorkoutNameError("Not logged in.");
          valid = false
        } else if (workoutName.length === 0) {
          setWorkoutNameError("Missing workout name.");
          valid = false
        } else if (workoutName.length > 100) {
          setWorkoutNameError("Workout too long.");
          valid = false
        } else {
          setWorkoutNameError(null);
        }
    
        if (setCount === 0) {
          setSetCountError("Missing set count.");
          valid = false
        } else if (setCount % 1 !== 0) {
          setSetCountError("Set count must be an integer.");
          valid = false
        } else if (setCount < 0) {
          setSetCountError("Set count must be positive.");
          valid = false
        } else {
          setSetCountError(null);
        }

        exercises.map((exercise, i) => {
          
            if (exercise.exercise_id === 0) {
                exercise.exercise_error = "Missing exercise.";
                valid = false;
            } else {
                exercise.exercise_error = null;
            }

            if (exercise.rep_count === 0) {
                exercise.rep_error = "Missing rep count.";
                valid = false
            } else if (exercise.rep_count % 1 !== 0) {
                exercise.rep_error = "Rep count must be an integer.";
                valid = false
            } else if (exercise.rep_count < 0) {
                exercise.rep_error = "Rep count must be positive.";
                valid = false
            } else {
                exercise.rep_error = null;
            }

        })

        const newList = [...exercises];
        setExercises(newList);

        if (valid) {
            const workoutData = {
                workoutName,
                creatorId: user_id,
                setCount,
                description,
                exercises
            }
          
            axios.post(`${baseUrl}/api/workout/create-workout`, workoutData)
                .then(response => {
                    console.log('Workout created: ', response.data);
                })
                .catch(error => {
                    console.error('Workout creation error:', error.response ? error.response.data : error.message);
                });

            props.backFunc();
        }
    }

    return (
        <div className="create-workout-menu">

            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create Workout</Typography>

            <Button id="backBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                props.backFunc();
            }}>{"<"} Back</Button>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>General Information</Typography>

            <Grid container spacing={2} padding={1}>

                <Grid item xs={12}>
                    <TextField id="inpWorkoutName" label="Workout Name" variant="filled" required error={Boolean(workoutNameError)} helperText={workoutNameError || ' '} value={workoutName} onChange={(event) => {
                        setWorkoutName(event.target.value);
                    }}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField id="inpSetCount" label="Set Count" variant="filled" required error={Boolean(setCountError)} helperText={setCountError || ' '} type="number" value={setCount} onChange={(event) => {
                        setSetCount(event.target.value);
                    }}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField id="inpDescription" label="Description" variant="filled" error={Boolean(descriptionError)} helperText={descriptionError || ' '} value={description} onChange={(event) => {
                        setDescription(event.target.value);
                    }}/>
                </Grid>

            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Exercises</Typography>

            <Grid container spacing={1} padding={1}>

                {exercises.map((exercise, i) => {
                    return <Grid container item xs={12} spacing={0.5} sx={{ width: 1 }}>
                        <Grid item xs={6} sx={{ width: 1 }}>
                            <FormControl sx={{ width: 1 }}>
                                <TextField
                                    select
                                    required
                                    id={"exercise" + (i+1).toString()}
                                    value={exercise.exercise_id}
                                    label={"Exercise " + (i+1).toString()}
                                    sx={{ width: 1 }}
                                    error={Boolean(exercise.exercise_error)}
                                    helperText={exercise.exercise_error || ' '}
                                    onChange={(event) => {
                                        exercise.exercise_id = event.target.value;
                                        const newList = [...exercises];
                                        setExercises(newList);
                                    }}
                                >
                                    {(typeof exerciseBank !== 'undefined') && exerciseBank.map((bankedExercise, j) => {
                                        return <MenuItem key={bankedExercise.exercise_id} value={bankedExercise.exercise_id}>{bankedExercise.exercise_name}</MenuItem>
                                    })}
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField id={"repCount" + (i+1).toString()} label="Rep Count" variant="outlined" required error={Boolean(exercise.rep_error)} helperText={exercise.rep_error || ' '} type="number" value={exercise.rep_count} onChange={(event) => {
                                exercise.rep_count = event.target.value;
                                const newList = [...exercises];
                                setExercises(newList);
                            }}/>
                        </Grid>
                        <Grid item xs={1}>
                            <Button id="deleteExercise" variant="contained" sx={{ width: 1 }} onClick={() => {
                                exercises.splice(i, 1);
                                const newList = [...exercises];
                                setExercises(newList);
                            }}>X</Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button id="upExercise" disabled={i === 0} variant="contained" sx={{ width: 1 }} onClick={() => {
                                const temp = exercises[i];
                                exercises[i] = exercises[i-1];
                                exercises[i-1] = temp;
                                const newList = [...exercises];
                                setExercises(newList);
                            }}>↑</Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button id="downExercise" disabled={i === exercises.length-1} variant="contained" sx={{ width: 1 }} onClick={() => {
                                const temp = exercises[i];
                                exercises[i] = exercises[i+1];
                                exercises[i+1] = temp;
                                const newList = [...exercises];
                                setExercises(newList);
                            }}>↓</Button>
                        </Grid>
                    </Grid>
                })}
            
                <Button id="addExerciseBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                    exercises.push({exercise_id: 0, rep_count: 0, exercise_error: "", rep_error: ""})
                    const newList = [...exercises];
                    setExercises(newList);
                }}>+</Button>

            </Grid>

            <Button id="createWorkoutBtn" variant="contained" onClick={() => {
                createWorkout();
            }}>Create Workout</Button>

        </div>
    )

}

export default CreateWorkoutMenu;