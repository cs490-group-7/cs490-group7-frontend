import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Card, Link } from '@mui/material'
import LinearProgress from '@mui/joy/LinearProgress';
import CreateWorkoutMenu from '../components/workout-components/CreateWorkoutMenu.js';
import EditWorkoutMenu from '../components/workout-components/EditWorkoutMenu.js';
import WorkoutDetailsMenu from '../components/workout-components/WorkoutDetailsMenu.js';
import WorkoutListMenu from '../components/workout-components/WorkoutListMenu.js';
import WorkoutCalendar from '../components/workout-components/WorkoutCalendar.js';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const RightMenu = {
    List: 0,
    Details: 1,
    Create: 2,
    Edit: 3
}

function Workouts () {

    const location = useLocation();

    const { user_id } = location.state || { user_id: false };

    const [rightMenu, setRightMenu] = useState(RightMenu.List);
    const [workoutId, setWorkoutId] = useState(0);

    function createNewWorkout () {
        setRightMenu(RightMenu.Create);
    }
    
    function returnToList () {
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

    return (
        <div className="workouts-page">

            <h1>Workouts</h1>
            <Grid container spacing={2}>

                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <WorkoutCalendar/>
                    </Card>
                </Grid>

                <Grid item xs={8}>
                    <Card variant="outlined" sx={{ padding: 2 }}>

                        {rightMenu === RightMenu.List && <WorkoutListMenu createFunc={createNewWorkout} viewFunc={viewWorkoutDetails} editFunc={editWorkoutDetails}>
                        </WorkoutListMenu>}

                        {rightMenu === RightMenu.Details && <WorkoutDetailsMenu backFunc={returnToList} workoutId={workoutId}>
                        </WorkoutDetailsMenu>}

                        {rightMenu === RightMenu.Create && <CreateWorkoutMenu backFunc={returnToList}>
                        </CreateWorkoutMenu>}

                        {rightMenu === RightMenu.Edit && <EditWorkoutMenu backFunc={returnToList} workoutId={workoutId}>
                        </EditWorkoutMenu>}
                    
                    </Card>
                </Grid>

            </Grid>
        </div>
    )

}

export default Workouts;