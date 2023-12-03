import React, { useState } from 'react';
import { Button, Grid, Card, CardContent, CardActions, Typography, AppBar, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const mockData = [
    { id: 1, name: 'Client 1', request: 'Request 1' },
    { id: 2, name: 'Client 2', request: 'Request 2' },
    // Add more clients as needed
];

export default function ClientRequests() {
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };
    
    const [clients, setClients] = useState(mockData);
    const handleAccept = (id) => {
        console.log(`Accepted request from client ${id}`);
    };
    const handleDecline = (id) => {
        console.log(`Declined request from client ${id}`);
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
                {clients.map((client) => (
                    <Card key={client.id} sx={{ maxWidth: 345, marginBottom: 2, marginTop: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {client.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {client.request}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary" onClick={() => handleAccept(client.id)}>Accept</Button>
                            <Button variant="contained" color="secondary" onClick={() => handleDecline(client.id)}>Decline</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </div>
    );
}