import React, { useState, useEffect } from 'react';
import { Button, Grid, Card, CardContent, CardActions, Typography, AppBar, Toolbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyClient() {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };

    useEffect(() => {
        // Fetch client requests when the component mounts
        axios.get(`${baseUrl}/api/users/client-requests`, { params: { userId: user_id } })
            .then(response => {
                setClients(response.data.clients);
            })
            .catch(error => {
                console.error('Error fetching client requests:', error);
                setError('Error fetching client requests');
            });
    }, [user_id]);

    const handleAccept = (id) => {
        // Backend call to accept client request
        axios.post(`${baseUrl}/api/users/accept-request`, { clientId: id, userId: user_id })
            .then(response => {
                // Remove the accepted client from the list of client requests
                setClients(clients.filter(client => client.id !== id));
            })
            .catch(error => {
                console.error('Error accepting client request:', error);
                setError('Error accepting client request');
            });
    };

    const handleDecline = (id) => {
        // Backend call to decline client request
        axios.post(`${baseUrl}/api/users/decline-request`, { clientId: id, userId: user_id })
            .then(response => {
                // Remove the declined client from the list of client requests
                setClients(clients.filter(client => client.id !== id));
            })
            .catch(error => {
                console.error('Error declining client request:', error);
                setError('Error declining client request');
            });
    };

    return (
        <div className="my-clients-page">
            <h1>My Clients</h1>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" href="#current-clients" sx={{ marginRight: '10px'}} >Current Clients</Button>
                    <Button color="inherit" href="#client-requests">Client Requests</Button>
                </Toolbar>
            </AppBar>
            <div id="client-requests">
                <h2>Client Requests</h2>
                {error && <Alert severity="error">{error}</Alert>}
                {clients.map((client) => (
                    <Card key={client.id} sx={{ maxWidth: 345, marginBottom: 2 }}>
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