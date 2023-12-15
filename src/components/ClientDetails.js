import React, { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
import { Button, Grid, TextField, Alert, MenuItem} from '@mui/material'
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function MyProgress () {
    const { clientId } = useParams();
    const location = useLocation();
    const { client, user_id } = location.state || { client: false };
    const navigate = useNavigate();

    const [dataPoints1] = useState([]);
    const [dataPoints2] = useState([]);
    const [dataPoints3] = useState([]);
    const [dataPoints4] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [workoutData, setWorkoutData] = useState([]);
    const [selectedButton, setSelectedButton] = useState("Weight");
    
    const [goalInfo, setGoalInfo] = useState([]);
    const [originalGoalInfo, setOriginalGoalInfo] = useState([]);
    const [currentWeight, setCurrentWeight] = useState();
    const [errorMessage, setErrorMessage] = useState(null);

    const [graphDataLoaded, setGraphDataLoaded] = useState(false);

    useEffect(() => {

        axios.post(`${baseUrl}/api/progress/progress-data`, {userId: clientId})
            .then((response) => {
                setProgressData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching progress data:', error);
            });

        const sinceDate = new Date(); sinceDate.setDate(sinceDate.getDate() - 7);
        axios.post(`${baseUrl}/api/progress/workout-progress`, {userId: clientId, sinceDate: sinceDate})
            .then((response) => {
                setWorkoutData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching workout progress data:', error);
            });

    }, [clientId]);

    

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
        } else if (type === 3){
            chart.options.title.text = "Workouts";
            chart.options.data[0].dataPoints = dataPoints4;
            chart.options.data[0].type = "scatter";
            chart.options.data[0].color = "blue";
            chart.options.axisY = {
                stripLines:[
                    {      
                        value : 1,
                        label : "100%",
                        thickness : 3,
                        color:"blue",
                        labelFontColor:"blue"
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
        for(var i = 0; i < progressData.length; i++){
            dataPoints1.push({x: new Date(progressData[i].date), y: Number(progressData[i].weight)});
            dataPoints2.push({x: new Date(progressData[i].date), y: Number(progressData[i].calorie_intake)});
            dataPoints3.push({x: new Date(progressData[i].date), y: Number(progressData[i].water_intake)});
        }
        for(var i = 0; i < workoutData.length; i++){
            dataPoints4.push({x: new Date(workoutData[i].session_date), y: Number(workoutData[i].completed/workoutData[i].listed)});
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
        axios.post(`${baseUrl}/api/progress/goal-info`, {userId: clientId})
          .then((response) => {
            setGoalInfo(response.data);
            setOriginalGoalInfo(response.data);
          })
          .catch((error) => {
            setErrorMessage(error.data ? error.data.message : 'Error reaching server');
        });
      }, [clientId])

    useEffect(() => {
        axios.post(`${baseUrl}/api/progress/current-weight`, {userId: clientId})
        .then((response) => {
            setCurrentWeight(response.data.weight);
        })
        .catch((error) => {
            setErrorMessage(error.data ? error.data.message : 'Error reaching server');
        });
      }, [clientId])

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
        <div className="client-details-page">
            <Button variant='contained' sx={{ marginTop: '20px'}} onClick={() => navigate('/my-clients', { state: location.state })}> {"<- Back"}</Button>
            <h1>{client.first_name} {client.last_name}'s Progress</h1>
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
                        <Grid item xs={12}>
                            <Button id="workouts" variant={selectedButton === "Workouts" ? "contained" : "outlined"}sx={{ width: 1 }} onClick={() => {
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
            </div>
            
        </div>

    )
}