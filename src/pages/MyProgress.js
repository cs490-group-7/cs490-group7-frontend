import React, { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
import { Button, Grid, TextField, Alert} from '@mui/material'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function MyProgress () {
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };

    var dataPoints1 = [], dataPoints2 = [], dataPoints3 = [];
    const [progressData, setProgressData] = useState([]);
    const [selectedButton, setSelectedButton] = useState("Weight");
    
    const [goalInfo, setGoalInfo] = useState([]);
    const [inputErrors, setInputErrors] = useState({weightGoal: '', weightGoalValue: ''});
    const [hasError, setHasError] = useState({weightGoal: false, weightGoalValue: false});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formDisabled, setFormDisabled] = useState(true);

    useEffect(() => {

        axios.post(`${baseUrl}/api/progress/progress-data`, {userId: user_id})
            .then((response) => {
                setProgressData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching progress data:', error);
            });

    }, []);

    for(var i = 0; i < progressData.length; i++){
        dataPoints1.push({x: new Date(progressData[i].date), y: Number(progressData[i].weight)});
        dataPoints2.push({x: new Date(progressData[i].date), y: Number(progressData[i].calorie_intake)});
        dataPoints3.push({x: new Date(progressData[i].date), y: Number(progressData[i].water_intake)});
    }

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
            ]
        });

        if (type === 0){
            chart.options.title.text = "Weight";
            chart.options.data[0].dataPoints = dataPoints1;
        } else if (type === 1){
            chart.options.title.text = "Calorie Intake";
            chart.options.data[0].dataPoints = dataPoints2;
        } else if (type === 2){
            chart.options.title.text = "Water Intake";
            chart.options.data[0].dataPoints = dataPoints3;
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
    
    let graphType = 0;

    setTimeout(function(){
        generateGraph(graphType);
    }, 1000);
    
    //---------
    useEffect(() => {
        axios.post(`${baseUrl}/api/progress/goal-info`, {userId: user_id})
          .then((response) => {
            setGoalInfo(response.data);
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
    const handleSubmit = () => {
        console.log(goalInfo)
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
    }
    function goalText(weightGoal){
        if (weightGoal === 'Gain'){
            return(
                <p>Gain weight to</p>
            )
        }
        else if (weightGoal === 'Maintain'){
            return(
                <p>Maintain weight at</p>
            )
        }
        else if (weightGoal === 'Lose'){
            return(
                <p>Lose weight to</p>
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
            <h3>Current Goal</h3>
            {goalText(goalInfo.weightGoal)}
            <TextField
            InputLabelProps={{ shrink: true}}
            label="Target Weight"
            value={goalInfo.weightGoalValue}
            onChange={(e) => handleChange(e, 'weightGoalValue')}
            error={hasError.weightGoalValue}
            helperText={inputErrors.weightGoalValue}
            sx={{width: '300px'}}
            variant='filled'
            />
            <br/>
            <br/>
            <Button variant='contained' onClick={handleSubmit} disabled={formDisabled}>
                Save Changes
            </Button>
            <div style={{ width: '40%'}}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </div>
        </div>

    )
}