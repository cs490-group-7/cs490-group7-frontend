import React, { useEffect, useState } from 'react'
import { Typography, Button } from '@mui/material'

function WorkoutListMenu (props) {

    return (
        <div className="workout-list-menu">

            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>List Menu</Typography>
            <Button id="createWorkoutBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                props.createFunc();
            }}>Create Workout</Button>

        </div>
    )

}

export default WorkoutListMenu;