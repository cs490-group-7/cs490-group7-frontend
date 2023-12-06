import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography } from '@mui/material';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function AdminPage() {
    const [pendingCoaches, setPendingCoaches] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/api/users/pending-coaches`)
            .then(response => {
                setPendingCoaches(response.data);
            })
            .catch(error => {
                console.error('Error fetching pending coaches:', error);
            });
    }, []);

    const handleApproval = (coachId, isApproved) => {
        axios.post(`${baseUrl}/api/users/update-coach-approval`, { coachId, isApproved })
            .then(() => {
                setPendingCoaches(pendingCoaches.filter(coach => coach.id !== coachId));
            })
            .catch(error => {
                console.error('Error updating coach approval:', error);
            });
    };

    return (
        <div className="admin-page">
            <h1>Admin Page - Coach Approvals</h1>
            {pendingCoaches.length === 0 ? (
                <p>No pending approvals.</p>
            ) : (
                pendingCoaches.map(coach => (
                    <Card key={coach.id} variant="outlined" sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h5">{coach.first_name} {coach.last_name}</Typography>
                            <Typography variant="body2">Specializations: {coach.specializations}</Typography>
                            <Typography variant="body2">Experience (Years): {coach.experience}</Typography>
                            <Typography variant="body2">City: {coach.city}</Typography>
                            <Typography variant="body2">State: {coach.state}</Typography>
                            <Typography variant="body2">Price: {coach.price}</Typography>
                            <Button color="primary" onClick={() => handleApproval(coach.id, true)}>Approve</Button>
                            <Button color="secondary" onClick={() => handleApproval(coach.id, false)}>Reject</Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
