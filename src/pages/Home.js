import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Card, Link } from '@mui/material'
import LinearProgress from '@mui/joy/LinearProgress';
import axios from 'axios';

function Home () {

    const [signedIn, setSignedIn] = useState(false);

    const [dailyFilled, setDailyFilled] = useState(false);
    const [calories, setCalories] = useState(null);
    const [waterIntake, setWaterIntake] = useState(null);
    const [weight, setWeight] = useState(null);
    const [caloriesError, setCaloriesError] = useState(null);
    const [waterIntakeError, setWaterIntakeError] = useState(null);
    const [weightError, setWeightError] = useState(null);

    const [goalMessage, setGoalMessage] = useState(null);
    const [goalBaseline, setGoalBaseline] = useState(0);
    const [goalTarget, setGoalTarget] = useState(0);
    const [goalCurrent, setGoalCurrent] = useState(0);
    const [progress, setProgress] = useState(0);

    const [workoutName, setWorkoutName] = useState(null);
    const [workoutCompletion, setWorkoutCompletion] = useState(false);

    useEffect(() => {
        // TODO: backend call to retrieve whether or not daily check-in has been filled today
        // TODO: backend call to retrieve goal overview
        // TODO: backend call to retrieve today's workout
        // TODO: backend call to retrieve progress status

        axios.get('http://localhost:4000/api/data/home-mock-data')
          .then(response => {
            const mockData = response.data;
            setDailyFilled(mockData.dailyFilled);
            setCalories(mockData.calories);
            setWaterIntake(mockData.waterIntake);
            setWeight(mockData.weight);
            setCaloriesError(mockData.caloriesError);
            setWaterIntakeError(mockData.waterIntakeError);
            setWeightError(mockData.weightError);
            setGoalMessage(mockData.goalMessage);
            setGoalBaseline(mockData.goalBaseline);
            setGoalTarget(mockData.goalTarget);
            setGoalCurrent(mockData.goalCurrent);
            setProgress(mockData.progress);
            setWorkoutName(mockData.workoutName);
            setWorkoutCompletion(mockData.workoutCompletion);
          })
          .catch(error => {
            console.error('Error fetching mock data:', error);
          });
        setProgress(getProgress()); // KEEP THIS HERE! this will automatically calculate progress given your goal parameters
    }, []);

    function submitDaily () {

        // TODO: submit the daily check-in

    }

    function getProgress () {
        return Math.abs((goalCurrent - goalBaseline)  / (goalTarget - goalBaseline));
    }

    function login () {

        // TODO: login

    }

    function logout () {

        // TODO: logout

    }

    return (
        <div className="home-page">

            <h1>Home</h1>
            <Grid container spacing={2}>

                {/* daily check-in */}
                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Daily Check-in</Typography>
                        {dailyFilled ? 
                            <div>
                                Daily check-in has already been filled.
                            </div> 
                            :
                            <div>
                                <TextField id="inpCalories" label="Calories Consumed" variant="filled" sx={{ margin: 1 }} error={caloriesError} helperText={caloriesError} required type="number" value={calories} onChange={(event) => {
                                    setCalories(event.target.value);
                                }}/>
                                <TextField id="inpWaterIntake" label="Water Intake (in mL)" variant="filled" sx={{ margin: 1 }} error={waterIntakeError} helperText={waterIntakeError} required type="number" value={waterIntake} onChange={(event) => {
                                    setWaterIntake(event.target.value);
                                }}/>
                                <TextField id="inpWeight" label="Weight" variant="filled" sx={{ margin: 1 }} error={weightError} helperText={weightError} required type="number" value={weight} onChange={(event) => {
                                    setWeight(event.target.value);
                                }}/>
                                <Button id="submitDailyBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                    submitDaily();
                                }}>
                                    Submit Check-in
                                </Button>
                            </div>
                        }
                    </Card>
                </Grid>

                {/* goal overview */}
                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Goal Overview</Typography>
                        {goalMessage !== null ? (
                            <div>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{goalMessage}</Typography>
                                <div>Goal Baseline: {goalBaseline}</div>
                                <div>Goal Target: {goalTarget}</div>
                                <div>Current Goal Standing: {goalCurrent}</div>
                            </div>)
                            : <i>No current goal.</i>}
                    </Card>
                </Grid>

                <Grid item xs={4}>

                    {/* today's workout */}
                    <Card variant="outlined" sx={{ padding: 2, mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Today's Workout</Typography>
                        {workoutName !== null ?
                            <div>
                                {workoutName}
                                <div>{workoutCompletion ? <i>Workout completed today.</i> : 
                                    <a
                                        className='active'
                                        href="/workouts"
                                    >
                                        Go to Workouts
                                    </a>
                                }</div>
                            </div>
                        :
                            <i>No workout for today.</i>
                        }
                    </Card>

                    {/* progess status */}
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Progress Status</Typography>
                        {goalMessage !== null ? <div>
                            <Typography align="center" variant="h6" color="primary" sx={{ margin: 2 }}>{Math.floor(progress*100)}%</Typography>
                            <LinearProgress determinate thickness={15} value={progress*100} />
                            <Typography align="center" sx={{ margin: 2 }}>{
                                progress === 0 ? 
                                    "Let's get started!"
                                : progress < 1 ?
                                    "Keep it up!"
                                :
                                    "Nice work!"
                            }</Typography>
                        </div> : 
                        <i>No current goal.</i>}
                    </Card>

                </Grid>
            </Grid>
            
        </div>
    )
}

export default Home;