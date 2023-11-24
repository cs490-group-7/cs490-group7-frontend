import React, { useEffect, useState } from 'react'
import CanvasJSReact from '@canvasjs/react-charts';
import { Typography, Button, Grid, TextField, Select, MenuItem, FormControl, Autocomplete } from '@mui/material'
//var CanvasJSReact = require('@canvasjs/react-charts');
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// module.exports = App;                              

export default function MyProgress () {
    var dataPoints1 = [], dataPoints2 = [], dataPoints3 = [];
    const [progressData, setProgressData] = useState([]);
    
    useEffect(() => {

        axios.get(`${baseUrl}/api/progress/progress-data`)
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
            <br/>
            <Grid container item xs={12} spacing={1} sx={{ width: 1 }}>
                <Grid item xs={2}>
                    <Grid container item xs={12} spacing={1} sx={{ width: 1 }}>
                        <Grid item xs={12}>
                            <Button id="weight" variant="outlined" sx={{ width: 1 }} onClick={() => {
                                graphType = 0;
                                generateGraph(graphType);
                            }}>Weight</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="calorieIntake" variant="outlined" sx={{ width: 1 }} onClick={() => {
                                graphType = 1;
                                generateGraph(graphType);
                            }}>Calorie Intake</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button id="waterIntake" variant="outlined" sx={{ width: 1 }} onClick={() => {
                                graphType = 2;
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