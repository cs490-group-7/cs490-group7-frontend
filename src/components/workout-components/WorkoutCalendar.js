import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import WorkoutAssignment from './WorkoutAssignment';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutCalendar (props) {

    const location = useLocation();
    const currentDate = new Date(); currentDate.setDate(currentDate.getDate() - 1);

    const { user_id } = location.state || { user_id: false };

    const [assignmentList, setAssignmentList] = useState();

    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {

      getAssignments();

    }, [assignmentList]);

    function assignWorkout (dayOfWeek) {
      const assignmentData = {
        userId: user_id,
        workoutId: props.selectedWorkout,
        dayOfWeek
      }
  
      axios.post(`${baseUrl}/api/workout/assign-workout`, assignmentData)
          .then(response => {
              console.log('Workout assigned: ', response.data);
              getAssignments();
          })
          .catch(error => {
              console.log('Workout assignment error: ', error.response.data);
              setErrorMessage('Workout assignment error:', error.response ? error.response.data : error.message);
          });
    }

    

    function getAssignments () {
      axios.post(`${baseUrl}/api/workout/get-assignments`, {userId: user_id})
            .then((response) => {
              const newList = [[], [], [], [], [], [], []];
              response.data.map((assignment) => {
                newList[assignment.day_of_week].push({workoutId: assignment.workout_id, workoutName: assignment.workout_name});
              });
              setAssignmentList(newList);
            })
            .catch((error) => {
              console.error('Error fetching assignment list:', error);
            });
    }

    return (
        <div className="workout-calendar">

            <Grid container spacing={0.5} padding={0.5}>

                {[0,1,2,3,4,5,6].map((i) => {
                  currentDate.setDate(currentDate.getDate() + 1); 
                  const dayOfWeek = currentDate.getDay();
                  return <Grid item xs={12} sx={{ width: 1 }}>
                      
                      <Card variant="outlined" sx={{ padding: 0, borderRadius: 0, borderColor: '#d9d9d9' }}>
                        <Card variant="outlined" sx={{ padding: 0.5, borderRadius: 0, bgcolor: '#d9d9d9', color: '#00008b', borderColor: '#d9d9d9' }}>
                          <Grid container spacing={0} padding={0}>
                            <Grid item xs={11} sx={{ width: 1 }}>
                              <b>{currentDate.toLocaleDateString('en-us', { weekday: "long" })}, {currentDate.toLocaleDateString('en-us', { month: "long", day: "numeric" })}</b>
                            </Grid>
                            <Grid item xs={1} sx={{ width: 1 }}>
                              {props.selectedWorkout !== null && <Button id="assignBtn" variant="text" size="small" sx={{ minWidth: 30, minHeight: 0, padding: 0 }} onClick={() => {
                                assignWorkout(dayOfWeek);
                              }}>+</Button>}
                            </Grid>
                          </Grid>
                        </Card>
                        <Card variant="outlined" sx={{ padding: 0.5, borderRadius: 0, border: 'none' }}>
                          {(typeof assignmentList === 'undefined') || assignmentList[dayOfWeek].length === 0 ? <Box sx={{ padding: 0.5 }}>Rest Day</Box> : assignmentList[dayOfWeek].map((assignment) => {
                            return <WorkoutAssignment workoutName={assignment.workoutName} workoutId={assignment.workoutId} dayOfWeek={dayOfWeek} viewFunc={props.viewFunc} rerenderFunc={getAssignments}/>;
                          })}
                        </Card>
                      </Card>
                  </Grid>
                })}

            </Grid>

        </div>
    )

}

export default WorkoutCalendar;