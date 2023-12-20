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

          <Button id="backBtn" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {
              props.backFunc();
          }}>← Back</Button>

          {(typeof workout !== 'undefined') && <div>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{workout.workout.workout_name}</Typography>
              {workout.workout.yours ? 
                <div><i>Created by you</i></div> :
                <div><i>Created by {workout.workout.first_name} {workout.workout.last_name}</i></div>
              }
              <div><i>{workout.workout.description}</i></div>
              <Grid container spacing={0.5} padding={0.5}>
                  {workout.exercises.map((exercise, i) => {
                      return <Grid item key={"exercise" + i.toString()} xs={12} sx={{ width: 1 }}>
                          <Card variant="outlined" sx={{ margin: 0.5, padding: 0.5, borderRadius: 2, borderColor: '#E8E8F5', backgroundColor: '#E8E8F5', color: "#00008b" }}>
                              <Grid container spacing={0.5} padding={0.5}>
                                  <Grid item xs={6} sx={{ width: 1 }}>
                                      <div><b>{exercise.exercise_name}</b></div>
                                  </Grid>
                                  <Grid item xs={6} sx={{ width: 1 }}>
                                      <div><i>{exercise.set_count} sets, {exercise.reps} reps each</i></div>
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