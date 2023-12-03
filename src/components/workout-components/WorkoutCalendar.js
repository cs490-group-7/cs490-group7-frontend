import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutCalendar (props) {

    const location = useLocation();
    const currentDate = new Date(); currentDate.setDate(currentDate.getDate() - 1);

    const { user_id } = location.state || { user_id: false };

    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {

    }, []);

    function assignWorkout (dayOfWeek) {
      const assignmentData = {
        userId: user_id,
        workoutId: props.selectedWorkout,
        dayOfWeek
      }
  
      axios.post(`${baseUrl}/api/workout/assign-workout`, assignmentData)
          .then(response => {
              console.log('Workout assigned: ', response.data);
          })
          .catch(error => {
              console.log('Workout assignment error: ', error.response.data);
              setErrorMessage('Workout assignment error:', error.response ? error.response.data : error.message);
          });
    }

    return (
        <div className="workout-calendar">

            <Grid container spacing={0.5} padding={0.5}>

                {[0,1,2,3,4,5,6].map((i) => {
                  currentDate.setDate(currentDate.getDate() + 1); 
                  const dayOfWeek = currentDate.getDay();
                  return <Grid item xs={12} spacing={0.5} sx={{ width: 1 }}>
                      
                      <Card variant="outlined" sx={{ padding: 0, borderRadius: 0, borderColor: '#d9d9d9' }}>
                        <Card variant="outlined" sx={{ padding: 0.5, borderRadius: 0, bgcolor: '#d9d9d9', color: '#00008b', borderColor: '#d9d9d9' }}>
                          <Grid container spacing={0} padding={0}>
                            <Grid item xs={11} spacing={0.5} sx={{ width: 1 }}>
                              <b>{currentDate.toLocaleDateString('en-us', { weekday: "long" })}, {currentDate.toLocaleDateString('en-us', { month: "long", day: "numeric" })}</b>
                            </Grid>
                            <Grid item xs={1} spacing={0.5} sx={{ width: 1 }}>
                              {props.selectedWorkout !== null && <Button id="assignBtn" variant="text" size="small" sx={{ minWidth: 30, minHeight: 0, padding: 0 }} onClick={() => {
                                assignWorkout(dayOfWeek);
                              }}>+</Button>}
                            </Grid>
                          </Grid>
                        </Card>
                        <Card variant="outlined" sx={{ padding: 1, borderRadius: 0, border: 'none' }}>
                          <div>Workout Information</div>
                        </Card>
                      </Card>
                  </Grid>
                })}

            </Grid>

        </div>
    )

}

export default WorkoutCalendar;