import React, { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
import { Typography, Button, Grid, TextField, Select, MenuItem, FormControl, Autocomplete } from '@mui/material'
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
        </div>

    )
}