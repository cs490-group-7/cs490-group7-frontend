import React, { useEffect, useState } from 'react'
import { Typography, Button, Grid, Card } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function WorkoutAssignment (props) {

    const location = useLocation();
    const currentDate = new Date(); currentDate.setDate(currentDate.getDate() - 1);

    const { client } = location.state || {  user_id: false, client: false };
    const user_id = parseInt(localStorage.getItem('userId'));

    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {

    }, []);

    function unassignWorkout () {
      const unassignmentData = {
        userId: client ? client.client_id : user_id,
        workoutId: props.workoutId,
        dayOfWeek: props.currentDate.getDay()
      }
  
      axios.post(`${baseUrl}/api/workout/unassign-workout`, unassignmentData)
          .then(response => {
              console.log('Workout unassigned: ', response.data);
              props.rerenderFunc();
          })
          .catch(error => {
              console.log('Workout unassignment error: ', error.response.data);
              setErrorMessage('Workout unassignment error:', error.response ? error.response.data : error.message);
          });
    }

    return (
        <div className="workout-assignment">

          <Card variant="outlined" sx={{ margin: 0.5, padding: 0.5, borderRadius: 0, borderColor: '#e8e8e8', backgroundColor: '#e8e8e8', color: "#00008b" }}>
            <div><b>{props.workoutName}</b></div>
            {!props.yours ? <div><i>Assigned by Coach {props.first_name} {props.last_name}</i></div> : ""}
            <div>
              {(props.loggable && !client) && <Button id="logBtn" variant="text" size="small" sx={{ borderRadius: 0, minWidth: 30, minHeight: 0, padding: 0.25, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff" }} onClick={() => {
                props.logFunc(props.workoutId, props.currentDate);
              }}>Log</Button>}
              <Button id="detailsBtn" variant="text" size="small" sx={{ borderRadius: 0, minWidth: 30, minHeight: 0, padding: 0.25, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff" }} onClick={() => {
                props.viewFunc(props.workoutId);
              }}>Details</Button>
              <Button id="unassignBtn" variant="text" size="small" sx={{ borderRadius: 0, minWidth: 30, minHeight: 0, padding: 0.25, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff" }} onClick={() => {
                unassignWorkout();
              }}>Unassign</Button>
            </div>
          </Card>

        </div>
    )

}

export default WorkoutAssignment;