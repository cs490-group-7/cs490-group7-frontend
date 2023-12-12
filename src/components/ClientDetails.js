import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CanvasJSReact from '@canvasjs/react-charts';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const { CanvasJSChart } = CanvasJSReact;

export default function ClientDetails() {
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };
    console.log("Location State:", location.state); // Log location.state
    const { clientId } = useParams();
    const [progressData, setProgressData] = useState([]);
    const [goalInfo, setGoalInfo] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch progress data
        axios.post(`${baseUrl}/api/progress/progress-data`, { userId: clientId })
            .then(response => {
                setProgressData(response.data);
            })
            .catch(error => {
                console.error('Error fetching progress data:', error);
            });

        // Fetch goal information
        axios.post(`${baseUrl}/api/progress/goal-info`, { userId: clientId })
            .then(response => {
                setGoalInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching goal data:', error);
            });
    }, [clientId]);

    // Function to render progress charts
    const renderProgressChart = (dataField, title) => {
        const dataPoints = progressData.map(data => ({
            x: new Date(data.date),
            y: data[dataField]
        }));

        const options = {
            title: { text: title },
            data: [{ type: "line", dataPoints: dataPoints }]
        };

        return <CanvasJSChart options={options} />;
    };

    return (
        <div id="client-details">
            <h1>Client Details: </h1>
            <div>
                <h2>Weight Progress</h2>
                {renderProgressChart('weight', 'Weight Progress')}
            </div>
            <div>
                <h2>Calorie Intake</h2>
                {renderProgressChart('calorie_intake', 'Calorie Intake')}
            </div>
            <div>
                <h2>Water Intake</h2>
                {renderProgressChart('water_intake', 'Water Intake')}
            </div>
            <div>
                <h2>Current Goal</h2>
                <p>{goalInfo.weightGoal}: {goalInfo.weightGoalValue} lbs</p>
            </div>
        </div>
    );
}
