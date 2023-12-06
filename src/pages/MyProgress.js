import React, { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
import { Button, Grid, TextField, Alert, MenuItem} from '@mui/material'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function MyProgress () {
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };

    const [dataPoints1, setDataPoints1] = useState([]);
    const [dataPoints2, setDataPoints2] = useState([]);
    const [dataPoints3, setDataPoints3] = useState([]);
    const [progressData, setProgressData] = useState([]);
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
                    color:"blue",
                    labelFontColor:"blue"
                }
                ]
            }
            
        } else if (type === 1){
            chart.options.title.text = "Calorie Intake";
            chart.options.data[0].dataPoints = dataPoints2;
            chart.options.axisY = {
                stripLines:[{}]
            }
        } else if (type === 2){
            chart.options.title.text = "Water Intake";
            chart.options.data[0].dataPoints = dataPoints3;
            chart.options.axisY = {
                stripLines:[{}]
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
        for(var i = 0; i < progressData.length; i++){
            dataPoints1.push({x: new Date(progressData[i].date), y: Number(progressData[i].weight)});
            dataPoints2.push({x: new Date(progressData[i].date), y: Number(progressData[i].calorie_intake)});
            dataPoints3.push({x: new Date(progressData[i].date), y: Number(progressData[i].water_intake)});
        }
        setGraphDataLoaded(true);
        }, [progressData])

    useEffect(() =>{
        if(graphDataLoaded){
            generateGraph(graphType);
        }
    }, [progressData])
        
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
        if (goalInfo.weightGoal === "Maintain" && createNew){
            goalInfo.weightGoalValue = currentWeight;
        }
        const reqBody = {...goalInfo, userId: user_id}

        axios.post(`${baseUrl}/api/progress/update-goal-info`, reqBody)
        .then((response) => {
            setErrorMessage(null)
            setSuccessMessage(response.data.message);
        })
        .catch((error) => {
            setSuccessMessage(null)
            setErrorMessage(error.data ? error.data.message : 'Error reaching server');
        });
        setOriginalGoalInfo(goalInfo);
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
                            <Button id="weight" variant={selectedButton === "Weight" ? "contained" : "outlined"} sx={{ width: 1 }} onClick={() => {
                                graphType = 0;
                                setSelectedButton("Weight");
                                generateGraph(graphType);
                            }}>Weight</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="calorieIntake" variant={selectedButton === "Calorie" ? "contained" : "outlined"} sx={{ width: 1 }} onClick={() => {
                                graphType = 1;
                                setSelectedButton("Calorie");
                                generateGraph(graphType);
                            }}>Calorie Intake</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="waterIntake" variant={selectedButton === "Water" ? "contained" : "outlined"}sx={{ width: 1 }} onClick={() => {
                                graphType = 2;
                                setSelectedButton("Water");
                                generateGraph(graphType);
                            }}>Water Intake</Button>
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
                        <Button variant='contained' onClick={handleEditGoal} disabled={editGoal || createGoal}>
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
                            <Button variant='contained' onClick={() => handleSubmit(false)} disabled={formDisabled}>
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
                        <Button variant='contained' onClick={handleCreateGoal} disabled={createGoal}>
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
                            <TextField id="inpWeightGoalValue" label="Target Weight (lbs)" variant="filled" error={Boolean(hasError.weightGoalValueError)} helperText={inputErrors.weightGoalValue || ' '} required value={goalInfo.weightGoalValue} onChange={(event) => {
                                handleChange(event, 'weightGoalValue');
                            }}/>
                            </div>}
                            <Button variant='contained' onClick={() => handleSubmit(true)} disabled={formDisabled}>
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