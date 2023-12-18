import React, { useState } from 'react';
import { Button, Grid, Card, CardContent, CardActions, Typography, AppBar, Toolbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function ClientRequests() {
    const location = useLocation();
    const user_id = parseInt(localStorage.getItem('userId'));
    const [requests, setRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        getRequests();
    }, [])
    
    const getRequests = () => {
        axios.post(`${baseUrl}/api/users/get-coach-requests`, {coachId: user_id})
            .then((response) => {
                setRequests(response.data);
            })
            .catch((error) => {
                setErrorMessage(error.response.data ? error.response.data.message : 'Error reaching server');
        });
    }
    
    const handlRequest = (client_id, accepted) => {
        axios.post(`${baseUrl}/api/users/handle-request`, {coachId: user_id, clientId: client_id, isAccepted: accepted})
            .then(() => {
                getRequests();
            })
            .catch((error) => {
                setErrorMessage(error.response.data ? error.response.data.message : 'Error reaching server');
        });
    };

    const navigate = useNavigate();
    const handleNavigate = (refresh) => {
        if(refresh){
            window.location.reload();
        }else{
            navigate("/my-clients", { state: location.state })
        }
    }

    return (
        <div className="my-clients-page">
            <h1>My Clients</h1>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={() => handleNavigate(false)} sx={{ marginRight: '10px'}} >Current Clients</Button>
                    <Button color="inherit" onClick={() => handleNavigate(true)} sx={{ color: 'black'}} variant='contained'>Client Requests</Button>
                </Toolbar>
            </AppBar>
            <div id="client-requests">
                <h2>Incoming requests:</h2>
                <div style={{ width: '40%'}}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
                {requests.length === 0 && (
                    <p>No results</p>
                )}
                {requests.map((client) => (
                    <Card key={client.id} sx={{ maxWidth: 345, marginBottom: 2, marginTop: 3 }}>
                        <CardContent sx={{ marginLeft: '10px'}}>
                            <Typography variant="h5" component="div" fontWeight="bold">
                                {client.first_name} {client.last_name}
                            </Typography>
                            <p>DOB: {client.date_of_birth.slice(0,10)}</p>
                            <p>Gender: {client.gender}</p>
                            <p>Height: {client.height}</p>
                            <p>Current Weight: {client.weight} lbs</p>
                            <p>Weight Goal: {client.weightGoal} Weight</p>
                            <p style={{ marginBottom: '0'}}>Goal Value: {client.weightGoalValue} lbs</p>
                        </CardContent>
                        <CardActions sx={{ marginLeft: '10px'}}>
                            <Button variant="contained" color="primary" onClick={() => handlRequest(client.client_id, true)}>Accept</Button>
                            <Button variant="contained" color="secondary" onClick={() => handlRequest(client.client_id, false)}>Decline</Button>
                        </CardActions>
                        <br></br>
                    </Card>
                ))}
            </div>
        </div>
    );
}