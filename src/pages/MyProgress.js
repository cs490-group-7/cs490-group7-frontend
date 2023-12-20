import React, { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
import { Button, Grid, TextField, Alert, MenuItem} from '@mui/material'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function MyProgress () {
    const user_id = parseInt(localStorage.getItem('userId'));

    const [dataPoints1, setDataPoints1] = useState([]);
    const [dataPoints2, setDataPoints2] = useState([]);
    const [dataPoints3, setDataPoints3] = useState([]);
    const [dataPoints4, setDataPoints4] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [workoutData, setWorkoutData] = useState([]);
    const [selectedButton, setSelectedButton] = useState("Weight");
    
    const [goalInfo, setGoalInfo] = useState([]);
    const [originalGoalInfo, setOriginalGoalInfo] = useState([]);
    const [currentWeight, setCurrentWeight] = useState();

    const [inputErrors, setInputErrors] = useState({weightGoal: '', weightGoalValue: ''});
    const [hasError, setHasError] = useState({weightGoal: false, weightGoalValue: false});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formDisabled, setFormDisabled] = useState(true);

    const [editGoal, setEditGoal] = useState(false);
    const [createGoal, setCreateGoal] = useState(false);

    const [graphDataLoaded, setGraphDataLoaded] = useState(false);

    useEffect(() => {

        axios.post(`${baseUrl}/api/progress/progress-data`, {userId: user_id})
            .then((response) => {
                setProgressData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching progress data:', error);
            });

        const sinceDate = new Date(); sinceDate.setDate(sinceDate.getDate() - 7);
        axios.post(`${baseUrl}/api/progress/workout-progress`, {userId: user_id, sinceDate: sinceDate})
            .then((response) => {
                setWorkoutData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching workout progress data:', error);
            });

    }, [user_id]);

    function generateGraph(type){
        var chart = new CanvasJS.Chart("chartContainer", { 
            theme: "light2",
			animationEnabled: true,
			zoomEnabled: true,
            title: {
                text: "text"
            },
            subtitles: [{
                text: "",
            }],
            data: [
            {
                type: "area",
                dataPoints: []
            }
            ],
            axisY : {}
        });

        if (type === 0){
            chart.options.title.text = "Weight";
            chart.options.data[0].dataPoints = dataPoints1;
            chart.options.data[0].color = "#00008b";
            //Find min & max
            let minValue = Infinity;
            let maxValue = -Infinity;
            for (let item of dataPoints1) {
                if (item.y < minValue)
                    minValue = item.y;
                if (item.y > maxValue)
                    maxValue = item.y;
            }
            chart.options.axisY = {
                minimum : Math.min(minValue-3, Number(goalInfo.weightGoalValue) - 5),
                maximum : Math.max(maxValue+3, Number(goalInfo.weightGoalValue) + 5),
                stripLines:[
                {      
                    value : goalInfo.weightGoalValue,
                    label : "Current Goal",
                    thickness : 3,
                    color:"#8080C5",
                    labelFontColor:"#8080C5"
                }
                ]
            }
            
        } else if (type === 1){
            chart.options.title.text = "Calorie Intake";
            chart.options.data[0].dataPoints = dataPoints2;
            chart.options.data[0].color = "#00008b";
            chart.options.axisY = {
                stripLines:[{}]
            }
        } else if (type === 2){
            chart.options.title.text = "Water Intake";
            chart.options.data[0].dataPoints = dataPoints3;
            chart.options.data[0].color = "#00008b";
            chart.options.axisY = {
                stripLines:[{}]
            }
        } else if (type === 3){
            chart.options.title.text = "Workouts";
            chart.options.data[0].dataPoints = dataPoints4;
            chart.options.data[0].type = "scatter";
            chart.options.data[0].color = "#00008b";
            chart.options.axisY = {
                stripLines:[
                    {      
                        value : 1,
                        label : "100%",
                        thickness : 3,
                        color:"#00008b",
                        labelFontColor:"#00008b"
                    }
                ]
            }
        }

        var isEmpty = !(chart.options.data[0].dataPoints && chart.options.data[0].dataPoints.length > 0);
        if(isEmpty)
            chart.options.subtitles.push({
            text : "No Data",
            fontSize: 20,
            verticalAlign : 'center',
        });
        chart.render();
    }
    
    var graphType = 0;


    useEffect(() => {
        if (dataPoints1.length == 0){
            for(var i = 0; i < progressData.length; i++){
                dataPoints1.push({x: new Date(progressData[i].date), y: Number(progressData[i].weight)});
                dataPoints2.push({x: new Date(progressData[i].date), y: Number(progressData[i].calorie_intake)});
                dataPoints3.push({x: new Date(progressData[i].date), y: Number(progressData[i].water_intake)});
            }
            console.log(dataPoints1);
        }
        if (dataPoints4.length == 0){
            for(var i = 0; i < workoutData.length; i++){
                dataPoints4.push({x: new Date(workoutData[i].session_date), y: Number(workoutData[i].completed/workoutData[i].listed)});
            }
        }
        setGraphDataLoaded(true);
        }, [progressData, workoutData])

    useEffect(() =>{
        if(graphDataLoaded){
            generateGraph(graphType);
        }
    }, [progressData, workoutData])
        
    //---------
    useEffect(() => {
        axios.post(`${baseUrl}/api/progress/goal-info`, {userId: user_id})
          .then((response) => {
            setGoalInfo(response.data);
            setOriginalGoalInfo(response.data);
          })
          .catch((error) => {
            setErrorMessage(error.data ? error.data.message : 'Error reaching server');
        });
      }, [user_id])

    useEffect(() => {
        axios.post(`${baseUrl}/api/progress/current-weight`, {userId: user_id})
        .then((response) => {
            setCurrentWeight(response.data.weight);
        })
        .catch((error) => {
            setErrorMessage(error.data ? error.data.message : 'Error reaching server');
        });
      }, [user_id])
      
    const handleChange = (e, field) => {
        setGoalInfo({...goalInfo, [field]: e.target.value})
        setInputErrors({...inputErrors, [field]: ''})
        setHasError({...hasError, [field]: false})
        setFormDisabled(false)
    }
    
    const handleSubmit = async (createNew) => {
        if(goalInfo.weightGoalValue === ""){
            setInputErrors({...inputErrors, weightGoalValue: 'This value cannot be empty'});
            setHasError({...hasError, weightGoalValue: true})
            return;
        }
        else if(!/^[1-9][0-9]*$/.test(goalInfo.weightGoalValue)){
            setInputErrors({...inputErrors, weightGoalValue: 'Incorrect format for weight'});
            setHasError({...hasError, weightGoalValue: true})
            return;
        }
        else if (goalInfo.weightGoalValue.length > 3) {
            setInputErrors({...inputErrors, weightGoalValue: 'Weight too long'});
            setHasError({...hasError, weightGoalValue: true})
            return;
        }
        if (goalInfo.weightGoal === "Maintain" && createNew){
            goalInfo.weightGoalValue = currentWeight;
        }
        const reqBody = {...goalInfo, userId: user_id, currentWeight: currentWeight, createNew: createNew}

        axios.post(`${baseUrl}/api/progress/update-goal-info`, reqBody)
        .then((response) => {
            setErrorMessage(null)
            setSuccessMessage(response.data.message);
            setOriginalGoalInfo(goalInfo);
        })
        .catch((error) => {
            setSuccessMessage(null)
            setErrorMessage(error.response ? error.response.data.message : error.message);
        });
        setTimeout(function(){
            setErrorMessage(null);
            setSuccessMessage(null);
            setCreateGoal(false);
            setEditGoal(false);
        }, 1700);
    }

    const handleEditGoal = () => {
        setEditGoal(true);
    }
    const handleCreateGoal = () => {
        setCreateGoal(true);
        setEditGoal(false);
    }

    function goalText(){
        var target = `${originalGoalInfo.weightGoalValue} pounds`
        if (originalGoalInfo.weightGoal === 'Gain'){
            return(
                <div><p>Current Goal: Gain weight to {target}</p></div>
            )
        }
        else if (originalGoalInfo.weightGoal === 'Maintain'){
            return(
                <div><p>Current Goal: Maintain weight at {target}</p></div>
            )
        }
        else if (originalGoalInfo.weightGoal === 'Lose'){
            return(
                <div><p>Current Goal: Lose weight to {target}</p></div>
            )
        }
    }

    return (
        <div className="my-progress-page">
            <h1>My Progress</h1>
            <br/>
            <Grid container item xs={12} spacing={1} sx={{ width: 1 }}>
                <Grid item xs={2}>
                    <Grid container item xs={12} spacing={1} sx={{ width: 1 }}>
                        <Grid item xs={12}>
                            <Button id="weight" variant={selectedButton === "Weight" ? "" : "outlined"} sx={{ borderRadius: 1, width: 1, minHeight: 0, padding: 0.8, borderColor: "#00008b", backgroundColor: selectedButton === "Weight" ? "#00008b" : "#ffffff", color: selectedButton !== "Weight" ? "#4040A8" : "#ffffff", '&:hover': { backgroundColor: selectedButton === "Weight" ? "#4040A8" : "#C0C0E2", borderColor: "#00008b" }, '&:disabled': { backgroundColor: "#e0e0e0" } }} onClick={() => {
                                graphType = 0;
                                setSelectedButton("Weight");
                                generateGraph(graphType);
                            }}>Weight</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="calorieIntake" variant={selectedButton === "Calorie" ? "" : "outlined"} sx={{ borderRadius: 1, width: 1, minHeight: 0, padding: 0.8, borderColor: "#00008b", backgroundColor: selectedButton === "Calorie" ? "#00008b" : "#ffffff", color: selectedButton !== "Calorie" ? "#4040A8" : "#ffffff", '&:hover': { backgroundColor: selectedButton === "Calorie" ? "#4040A8" : "#C0C0E2", borderColor: "#00008b" }, '&:disabled': { backgroundColor: "#e0e0e0" } }} onClick={() => {
                                graphType = 1;
                                setSelectedButton("Calorie");
                                generateGraph(graphType);
                            }}>Calorie Intake</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="waterIntake" variant={selectedButton === "Water" ? "" : "outlined"} sx={{ borderRadius: 1, width: 1, minHeight: 0, padding: 0.8, borderColor: "#00008b", backgroundColor: selectedButton === "Water" ? "#00008b" : "#ffffff", color: selectedButton !== "Water" ? "#4040A8" : "#ffffff", '&:hover': { backgroundColor: selectedButton === "Water" ? "#4040A8" : "#C0C0E2", borderColor: "#00008b" }, '&:disabled': { backgroundColor: "#e0e0e0" } }} onClick={() => {
                                graphType = 2;
                                setSelectedButton("Water");
                                generateGraph(graphType);
                            }}>Water Intake</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="workouts" variant={selectedButton === "Workouts" ? "" : "outlined"} sx={{ borderRadius: 1, width: 1, minHeight: 0, padding: 0.8, borderColor: "#00008b", backgroundColor: selectedButton === "Workouts" ? "#00008b" : "#ffffff", color: selectedButton !== "Workouts" ? "#4040A8" : "#ffffff", '&:hover': { backgroundColor: selectedButton === "Workouts" ? "#4040A8" : "#C0C0E2", borderColor: "#00008b" }, '&:disabled': { backgroundColor: "#e0e0e0" } }} onClick={() => {
                                graphType = 3;
                                setSelectedButton("Workouts");
                                generateGraph(graphType);
                            }}>Workouts</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10} height="400px">
                    <div id="chartContainer"></div> 
                </Grid>
            </Grid>
            
            <br/>
            <br/>
            <h2>Goal:</h2>
            <div style={{ fontSize: '18px'}}>
            {goalText()}
            <p> Current Weight: {currentWeight} pounds</p>
                <Grid container item xs={12} spacing={1} sx={{ width: 1 }}>
                    <Grid item xs={2}>
                        <Button onClick={handleEditGoal} disabled={editGoal || createGoal} sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" }, '&:disabled': { backgroundColor: "#e0e0e0" } }}>
                            Edit Goal
                        </Button>
                        <br/>
                        <br/>
                        { (editGoal === true) && 
                            <div><TextField
                            InputLabelProps={{ shrink: true}}
                            label="Target Weight (lbs)"
                            value={goalInfo.weightGoalValue}
                            onChange={(e) => handleChange(e, 'weightGoalValue')}
                            error={hasError.weightGoalValue}
                            helperText={inputErrors.weightGoalValue}
                            sx={{width: '150px'}}
                            variant='filled'
                            />
                            <br/>
                            <br/>
                            <Button onClick={() => handleSubmit(false)} disabled={formDisabled} sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" }, '&:disabled': { backgroundColor: "#e0e0e0" } }}>
                                Save Changes
                            </Button>
                            <div style={{ width: '100%'}}>
                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                            </div></div>}
                    </Grid>
                    <Grid item xs={4}>
                        {(editGoal === true) && 
                        <div>
                        <Button onClick={handleCreateGoal} disabled={createGoal} sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" }, '&:disabled': { backgroundColor: "#e0e0e0" } }}>
                            Create New Goal
                        </Button>
                        <br/>
                        </div>
                        }
                        { (createGoal === true) && 
                        <div>
                            <TextField
                            required value={goalInfo.weightGoal}
                            onChange={(event) => handleChange(event, 'weightGoal')}
                            select
                            sx={{width: "150px"}}
                            label="Select One"
                            helperText={inputErrors.weightGoal || ' '}
                            error={Boolean(hasError.weightGoalError)}
                        >
                            <MenuItem value={"Gain"}>
                            Gain
                            </MenuItem>
                            <MenuItem value={"Lose"}>
                            Lose
                            </MenuItem>
                            <MenuItem value={"Maintain"}>
                            Maintain
                            </MenuItem>
                            </TextField>
                            <br/>
                            { (goalInfo.weightGoal === "Gain" || goalInfo.weightGoal === "Lose") && 
                            <div>
                            <TextField 
                            InputLabelProps={{ shrink: true}}
                            label="Target Weight (lbs)" 
                            value={goalInfo.weightGoalValue}
                            variant="filled" 
                            error={hasError.weightGoalValue} 
                            helperText={inputErrors.weightGoalValue || ' '} 
                            onChange={(event) => {
                                handleChange(event, 'weightGoalValue');
                            }}/>
                            </div>}
                            <Button onClick={() => handleSubmit(true)} disabled={formDisabled} sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" }, '&:disabled': { backgroundColor: "#e0e0e0" } }}>
                                Save Changes
                            </Button>
                            <div style={{ width: '80%'}}>
                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                            </div>
                        </div>}
                    </Grid>
                </Grid>

                
            </div>
            
        </div>

    )
}