import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function AdminPage() {
    const [pendingCoaches, setPendingCoaches] = useState([]);
    const [exerciseBank, setExerciseBank] = useState([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseType, setNewExerciseType] = useState('');

    useEffect(() => {
        fetchPendingCoaches();
        fetchExerciseBank();
    }, []);

    const fetchPendingCoaches = () => {
        axios.get(`${baseUrl}/api/users/pending-coaches`)
            .then(response => {
                setPendingCoaches(response.data);
            })
            .catch(error => {
                console.error('Error fetching pending coaches:', error);
            });
    };

    const fetchExerciseBank = () => {
        axios.get(`${baseUrl}/api/users/exercise-bank`)
            .then(response => {
                setExerciseBank(response.data);
            })
            .catch(error => {
                console.error('Error fetching exercise bank data:', error);
            });
    };

    const handleApproval = (coachId, isApproved) => {
        axios.post(`${baseUrl}/api/users/update-coach-approval`, { coachId, isApproved })
            .then(() => {
                setPendingCoaches(pendingCoaches.filter(coach => coach.id !== coachId));
            })
            .catch(error => {
                console.error('Error updating coach approval:', error);
            });
    };

    const handleAddExercise = () => {
        axios.post(`${baseUrl}/api/users/add-exercise`, { name: newExerciseName, type: newExerciseType })
            .then(() => {
                fetchExerciseBank();
            })
            .catch(error => {
                console.error('Error adding exercise:', error);
            });
    };

    const handleDeleteExercise = (exerciseId) => {
        axios.post(`${baseUrl}/api/users/delete-exercise`, { id: exerciseId })
            .then(() => {
                fetchExerciseBank();
            })
            .catch(error => {
                console.error('Error deleting exercise:', error);
            });
    };

    return (
        <div className="admin-page" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
                <h1>Admin Page - Coach Approvals</h1>
                {pendingCoaches.length === 0 ? (
                    <p>No pending approvals.</p>
                ) : (
                    pendingCoaches.map(coach => (
                        <Card key={coach.id} variant="outlined" sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h5">{coach.first_name} {coach.last_name}</Typography>
                                <Typography variant="body1">Specializations: {coach.specializations}</Typography>
                                <Typography variant="body1">Experience (Years): {coach.experience}</Typography>
                                <Typography variant="body1">City: {coach.city}</Typography>
                                <Typography variant="body1">State: {coach.state}</Typography>
                                <Typography variant="body1">Price: {coach.price}</Typography>
                                <Button color="primary" onClick={() => handleApproval(coach.id, true)} variant='contained' sx={{ margin: '10px 0 0 5px'}}>Approve</Button>
                                <Button color="secondary" onClick={() => handleApproval(coach.id, false)} variant='contained' sx={{ margin: '10px 0 0 5px'}}>Reject</Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            <div style={{ width: '50%' }}>
                <h1>Exercise Bank</h1>
                <TextField label="Exercise Name" value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} />
                <TextField label="Exercise Type" value={newExerciseType} onChange={(e) => setNewExerciseType(e.target.value)} />
                <Button onClick={handleAddExercise}>Add Exercise</Button>
                {exerciseBank.map((exercise, index) => (
                    <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h5">{exercise.name}</Typography>
                            <Typography variant="body1">Type: {exercise.type}</Typography>
                            <Button color="secondary" onClick={() => handleDeleteExercise(exercise.id)}>Delete</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
