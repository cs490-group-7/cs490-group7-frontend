import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutDetailsMenu (props) {

    const [workout, setWorkout] = useState();

    useEffect(() => {

        const workoutIdData = {
            workoutId: props.workoutId
        };

        axios.post(`${baseUrl}/api/workout/workout-details`, workoutIdData)
            .then((response) => {
                setWorkout(response.data);
            })
            .catch((error) => {
                console.error('Error fetching workout details:', error);
            });

    }, [props]);

    return (
        <div className="workout-details-menu">

          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Workout Details</Typography>

          <Button id="backBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
              props.backFunc();
          }}>{"<"} Back</Button>

          {(typeof workout !== 'undefined') && <div>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{workout.workout.workout_name}</Typography>
              <div><i>{workout.workout.description}</i></div>
              <div>Set Count: {workout.workout.set_count}</div>
              <Grid container spacing={0.5} padding={0.5}>
                  {workout.exercises.map((exercise) => {
                      return <Grid item xs={12} spacing={0.5} sx={{ width: 1 }}>
                          <Card variant="outlined" sx={{ padding: 1 }}>
                              <Grid container spacing={0.5} padding={0.5}>
                                  <Grid item xs={6} spacing={0.5} sx={{ width: 1 }}>
                                      <div><b>{exercise.exercise_name}</b></div>
                                  </Grid>
                                  <Grid item xs={6} spacing={0.5} sx={{ width: 1 }}>
                                      <div><i>{exercise.reps} reps</i></div>
                                  </Grid>
                              </Grid>
                          </Card>
                      </Grid>
                  })}
              </Grid>
          </div>}

        </div>
    )

}

export default WorkoutDetailsMenu;