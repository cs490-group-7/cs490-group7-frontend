import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, TextField, Button, Card, Link, Alert } from '@mui/material'
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

function Dashboard () {

    const navigate = useNavigate();
    const location = useLocation();

    const user_id = localStorage.getItem('userId');

    const [signedIn, setSignedIn] = useState(user_id);

    const [dailyFilled, setDailyFilled] = useState(false);
    const [calories, setCalories] = useState(null);
    const [waterIntake, setWaterIntake] = useState(null);
    const [weight, setWeight] = useState(null);
    const [mood, setMood] = useState("");
    const [caloriesError, setCaloriesError] = useState(null);
    const [waterIntakeError, setWaterIntakeError] = useState(null);
    const [weightError, setWeightError] = useState(null);
    const [moodError, setMoodError] = useState(null);

    const [goalMessage, setGoalMessage] = useState(null);
    const [weightGoal, setWeightGoal] = useState(null);
    const [goalBaseline, setGoalBaseline] = useState(0);
    const [goalTarget, setGoalTarget] = useState(0);
    const [goalCurrent, setGoalCurrent] = useState(0);
    const [progress, setProgress] = useState(0);

    const [workoutName, setWorkoutName] = useState(null);
    const [workoutCompletion, setWorkoutCompletion] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, SetSuccessMessage] = useState(null);

    const { isCoach } = location.state || { isCoach: false };
    useEffect(() => {
        axios.post(`${baseUrl}/api/data/dashboard-data`, {userId: user_id})
            .then((response) => {
                setGoalBaseline(response.data.goalBaseline);
                setGoalTarget(response.data.weightGoalValue);
                setGoalCurrent(response.data.currentWeight);
                if (response.data.weightGoal === "Maintain"){
                    setGoalMessage(response.data.weightGoal + " " + response.data.weightGoalValue + " pounds");
                }
                else if (response.data.weightGoal === "Gain"){
                    if (response.data.weightGoalValue-response.data.currentWeight > 0){
                        setGoalMessage(response.data.weightGoal + " " + (response.data.weightGoalValue-response.data.currentWeight) + " pounds");
                    }
                    else{
                        setGoalMessage("Goal reached!")
                    }
                }
                else{
                    if (response.data.currentWeight-response.data.weightGoalValue > 0){
                        setGoalMessage(response.data.weightGoal + " " + (response.data.currentWeight-response.data.weightGoalValue) + " pounds");
                    }
                    else{
                        setGoalMessage("Goal reached!")
                    }
                }
                setWeightGoal(response.data.weightGoal);

                setWorkoutName(response.data.workout_name);
                setWorkoutCompletion(response.data.workoutCompletion);
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
            });
        //setProgress(getProgress()); // KEEP THIS HERE! this will automatically calculate progress given your goal parameters
    }, []);
    function submitDaily () {
        if(!signedIn){
            setErrorMessage("You must log in before submitting a daily survey");
            return;
        }
        if(dailyFilled){
            setErrorMessage("You already submitted a survey for today");
            return;
        }else{
        let valid = true;
        // TODO: submit the daily check-in
        if(calories < 1){
            setCaloriesError("Missing Calorie Intake");
            valid = false;
        }else{
            setCaloriesError(null);
        }

        if(waterIntake < 1){
            setWaterIntakeError("Missing Water Intake");
            valid = false;
        }else{
            setWaterIntakeError(null);
        }

        if (weight < 1) {
            setWeightError("Missing weight.");
            valid = false
          } else if (weight < 10) {
            setWeightError("Weight too short.");
            valid = false
          }  else if (weight > 999) {
            setWeightError("Weight too large.");
            valid = false
          } else if (!/^[1-9][0-9]*$/.test(weight)) {
            setWeightError("Incorrect weight format.");
            valid = false
          } else {
            setWeightError(null);
          }
            setMoodError(null);
          
        // Trigger call to backend
        if(valid){
          const surveyData = {
            user_id,
            calories,
            waterIntake,
            weight,
            mood
          };
    
          // Determine the endpoint based on whether the user is a coach or not
          axios.post(`${baseUrl}/api/surveys/daily-survey`, surveyData)
            .then(response => {
              SetSuccessMessage('Daily Survey Submitted!');
              setDailyFilled(true);
            })
            .catch(error => {
                console.error('Survey submission error:', error.response ? error.response.data : error.message);
                if (error.response && error.response.data && error.response.data.message === "You've already submitted a survey for today") {
                  // Handle duplicate entry error
                  setErrorMessage("You've already submitted a survey for today");
                } else {
                  // Handle other errors
                  setErrorMessage('Survey submission error:', error.response ? error.response.data : error.message);
                }
            });
        }
          
    }
}

    function getProgress () {
        let progress = 0
        if (goalTarget - goalBaseline === 0 || weightGoal === "Maintain"){
            return 1-(Math.abs(goalTarget - goalCurrent) / goalTarget);
        }
        else if (weightGoal === "Lose"){
            progress = (goalBaseline - goalCurrent)  / (goalBaseline - goalTarget);
        }
        else { //weightGoal === "Gain"
            progress = (goalCurrent - goalBaseline)  / (goalTarget - goalBaseline);
        }
        if (progress > 1){
            return 1;
        }
        
        return progress;
    }

    setTimeout(function(){
        setProgress(getProgress());
    }, 0);

    function login () {

        // TODO: login

    }

    function logout () {

        // TODO: logout

    }

    return (
        <div className="dashboard-page">

            <h1>Dashboard</h1>
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
                                <TextField id="inpCalories" label="Calories Consumed" variant="filled" sx={{ margin: 1 }} error={caloriesError} helperText={caloriesError} required type="number" onChange={(event) => {
                                    setCalories(event.target.value);
                                }}/>
                                <TextField id="inpWaterIntake" label="Water Intake (in mL)" variant="filled" sx={{ margin: 1 }} error={waterIntakeError} helperText={waterIntakeError} required type="number" onChange={(event) => {
                                    setWaterIntake(event.target.value);
                                }}/>
                                <TextField id="inpWeight" label="Weight" variant="filled" sx={{ margin: 1 }} error={weightError} helperText={weightError} required type="number" onChange={(event) => {
                                    setWeight(event.target.value);
                                }}/>
                                <TextField id="inpMood" label="Mood" variant="filled" sx={{ margin: 1 }} error={moodError} helperText={moodError} onChange={(event) => {
                                    setMood(event.target.value);
                                }}/><br></br>
                                <Button id="submitDailyBtn" variant="contained" sx={{ margin: 1 }} onClick={() => {
                                    submitDaily();
                                }}>
                                    Submit Check-in
                                </Button>
                            </div>
                        }
                    </Card>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                </Grid>
                {/* goal overview */}
                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Goal Overview</Typography>
                        {goalMessage !== null ? (weightGoal !== "Maintain" ?
                            (<div>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{goalMessage}</Typography>
                                <div>Goal Baseline: {goalBaseline}</div>
                                <div>Goal Target: {goalTarget}</div>
                                <div>Current Weight: {goalCurrent}</div>
                            </div>)
                            : (<div>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{goalMessage}</Typography>
                                <div>Current Weight: {goalCurrent}</div>
                                </div>))
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
                                        className={location.pathname === '/workouts' ? 'active' : ''} 
                                        onClick={() => navigate("/workouts", { state: location.state })} 
                                        style={{cursor: "pointer", color: "blue", textDecoration: "underline"}}
                                    >
                                        Go to Workouts
                                        </a>
                                }</div>
                            </div>
                        :
                            <i>Rest Day</i>
                        }
                    </Card>

                    {/* progess status */}
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Progress Status</Typography>
                        {goalMessage !== null ? <div>
                            <Typography align="center" variant="h6" color="primary" sx={{ margin: 2 }}>{Math.floor(progress*100)}%</Typography>
                            <LinearProgress determinate thickness={15} value={progress*100} />
                            <Typography align="center" sx={{ margin: 2 }}>{
                                progress <= 0 ? 
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

export default Dashboard;