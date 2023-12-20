import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Card, Link } from '@mui/material'
import LinearProgress from '@mui/joy/LinearProgress';
import CreateWorkoutMenu from '../components/workout-components/CreateWorkoutMenu.js';
import EditWorkoutMenu from '../components/workout-components/EditWorkoutMenu.js';
import WorkoutDetailsMenu from '../components/workout-components/WorkoutDetailsMenu.js';
import WorkoutListMenu from '../components/workout-components/WorkoutListMenu.js';
import LogSessionMenu from '../components/workout-components/LogSessionMenu.js';
import WorkoutCalendar from '../components/workout-components/WorkoutCalendar.js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const RightMenu = {
    List: 0,
    Details: 1,
    Create: 2,
    Edit: 3,
    Log: 4
}

function Workouts () {

    const { clientId } = useParams();
    const location = useLocation();
    const { client } = location.state || {  user_id: false, client: false };
    const user_id = parseInt(localStorage.getItem('userId'));

    const [rightMenu, setRightMenu] = useState(RightMenu.List);
    const [workoutId, setWorkoutId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    function createNewWorkout () {
        setRightMenu(RightMenu.Create);
    }
    
    function returnToList () {
        setWorkoutId(null);
        setSelectedDate(null);
        setRightMenu(RightMenu.List);
    }

    function viewWorkoutDetails (wid) {
        setWorkoutId(wid);
        setRightMenu(RightMenu.Details);
    }

    function editWorkoutDetails (wid) {
        setWorkoutId(wid);
        setRightMenu(RightMenu.Edit);
    }

    function logSession (wid, sd) {
        setWorkoutId(wid);
        setSelectedDate(sd);
        setRightMenu(RightMenu.Log);
    }

    function selectWorkout (wid) {
        setWorkoutId(wid);
    }

    const navigate = useNavigate();

    return (
        <div className="workouts-page">

            {client ? 
                <div>
                    <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '20px', backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => {location.state.client = false; navigate('/my-clients', { state: location.state })}}> {"← Back"}</Button>
                    <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '20px', marginLeft: '20px', backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => navigate(`/my-clients/${client.client_id}`, { state: location.state })}> {"View Progress"}</Button>
                    <h1>{client.first_name} {client.last_name}'s Workouts</h1>
                </div>
                :
                <h1>Workouts</h1>
            }
            <Grid container spacing={2}>

                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ padding: 2, borderRadius: 2 }}>
                        <WorkoutCalendar selectedWorkout={workoutId} viewFunc={viewWorkoutDetails} logFunc={logSession}/>
                    </Card>
                </Grid>

                <Grid item xs={8}>
                    <Card variant="outlined" sx={{ padding: 2, borderRadius: 2 }}>

                        {rightMenu === RightMenu.List && <WorkoutListMenu createFunc={createNewWorkout} viewFunc={viewWorkoutDetails} editFunc={editWorkoutDetails} selectFunc={selectWorkout}>
                        </WorkoutListMenu>}

                        {rightMenu === RightMenu.Details && <WorkoutDetailsMenu backFunc={returnToList} workoutId={workoutId}>
                        </WorkoutDetailsMenu>}

                        {rightMenu === RightMenu.Create && <CreateWorkoutMenu backFunc={returnToList}>
                        </CreateWorkoutMenu>}

                        {rightMenu === RightMenu.Edit && <EditWorkoutMenu backFunc={returnToList} workoutId={workoutId}>
                        </EditWorkoutMenu>}

                        {rightMenu === RightMenu.Log && <LogSessionMenu backFunc={returnToList} workoutId={workoutId} selectedDate={selectedDate}>
                        </LogSessionMenu>}
                    
                    </Card>
                </Grid>

            </Grid>
        </div>
    )

}

export default Workouts;