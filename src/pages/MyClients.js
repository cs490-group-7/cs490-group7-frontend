import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Card, CardContent, CardActions, Typography, AppBar, Toolbar, Link, Dialog, DialogTitle, DialogContent} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyClient() {
    const location = useLocation();
    const user_id = parseInt(localStorage.getItem('userId'));
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedClientFName, setSelectedClientFname] = useState(null);
    const [currentClients, setCurrentClients] = useState([]);
    const [isPendingApproval, setIsPendingApproval] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        //fetch coach status
        axios.post(`${baseUrl}/api/coach/check-approval-status`, {userId: user_id})
        .then((response) => { 
            if(response.data.isPendingApproval) {
                setIsPendingApproval(true);
            } else {
                // Fetch current clients if the coach is approved
                axios.post(`${baseUrl}/api/coach/get-current-clients`, {userId: user_id})
                .then((response) => {
                    setCurrentClients(response.data);
                })
                .catch((error) => {
                    setErrorMessage(error.data ? error.data.message : 'Error reaching server');
                });
            }
        })
        .catch((error) => {
          setErrorMessage(error.data ? error.data.message : 'Error reaching server');
        });
      }, [user_id])

    const navigate = useNavigate();
    const handleNavigate = (refresh) => {
        if(refresh){
            window.location.reload();
        }else{
            navigate("./requests", { state: location.state })
        }
    }

    // State for the message input
    const [messageInput, setMessageInput] = useState('');
    // State for displaying messages
    const [messages, setMessages] = useState([]);
    const [showMessageBox, setShowMessageBox] = useState(false);
    // State for the interval ID
    const [intervalId, setIntervalId] = useState(null);
    useEffect(() => {
        let interval = null;
      
        if (showMessageBox) {
            // Fetch the messages when the message box is opened
            interval = setInterval(() => {
                axios.post(`${baseUrl}/api/chat/get-messages`, { coach_id: user_id, client_id: selectedClient })
                .then((response) => {
                    setMessages(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }, 5000); // Fetches messages every 5 seconds
        } else if (!showMessageBox && interval !== null) {
            // Clear the interval when the message box is closed
            clearInterval(interval);
        }
      
          // Save the interval ID
          setIntervalId(interval);
      
          // Clear the interval when the component unmounts
          return () => clearInterval(interval);
      }, [user_id, selectedClient, showMessageBox]);

      
    // Modify the handleMessageBox function to fetch the messages and update the state
    const handleMessageBox = (client_id, clientFirstName) => {
        setShowMessageBox(true);
        setSelectedClient(client_id); // Set the selected client
        setSelectedClientFname(clientFirstName);

        axios.post(`${baseUrl}/api/chat/get-messages`, { coach_id: user_id, client_id: client_id })
        .then((response) => {
            setMessages(response.data); // Update the messages state
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

// Function to handle sending a message
const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
        // Prepare the message data
        const messageData = {
            user_id: user_id,
            user_type: 'Coach',
            coach_id: user_id,
            client_id: selectedClient,
            message: messageInput,
        };
  
        // Make a POST request to the '/send-message' endpoint
        axios.post(`${baseUrl}/api/chat/send-message`, messageData)
        .then((response) => {
            if (response.data.message === 'Message saved successfully.') {
                setMessageInput(''); // Clear the message input
  
                // Fetch the messages for the selected client
                axios.post(`${baseUrl}/api/chat/get-messages`, { coach_id: user_id, client_id: selectedClient })
                .then((response) => {
                    setMessages(response.data); // Update the messages state
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            } else {
                console.error('Error:', response.data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
  };  

    // Function to handle "Enter" key press in the message input
    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Render message box
    const renderMessageBox = () => (
        <Box style={{ height: '600px', position: 'relative', border: '2px solid rgba(0,0,0,0.10)', borderRadius: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
            style={{
            background: '#f0f0f0', 
            padding: '8px',
            }}
        >
            <Typography variant="h5" style={{fontWeight: 'bold'}} >Message {selectedClientFName}:</Typography>
            <Button sx={{ float: 'right'}} onClick={() => setShowMessageBox(false)}>Close</Button>
        </Box>
        {/* Message history */}
        <Box
            style={{
            flex: 1, 
            overflowY: 'auto', 
            background: '#fff', 
            padding: '8px',
            }}
        >
        {/* Display messages */}
        {messages.length !== 0 ? (
            messages.map((message, index) => (
                <Box key={index} mb={1}>
                    {message.from_coach ? (
                        <>
                            <Typography variant="body1" component="div" color="blue">
                                You: {message.message}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1" component="div" color="purple">
                            {selectedClientFName}: {message.message}
                        </Typography>
                    )}
                </Box>
            ))
        ) : (
            <Typography variant="body1" component="div" color="grey">
                No messages...
            </Typography>
        )}

        </Box>
        {/* Message input */}
        <TextField
            id="messageInput"
            label="Send a message..."
            variant="outlined"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            onKeyPress={handleEnterKeyPress}
            style={{
            background: '#f0f0f0', 
            margin: '10px',
            width: '95%',
            }}
        />
        </Box>
    );

    return (
        <div className="my-clients-page">
            <h1>My Clients</h1>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={() => handleNavigate(true)} sx={{ marginRight: '10px', color: 'black'}} variant='contained'>Current Clients</Button>
                    <Button color="inherit" onClick={() => handleNavigate(false)} >Client Requests</Button>
                </Toolbar>
            </AppBar>
            <div id="current-clients" style={{ width: '40%'}}>
                <h2>Your current clients:</h2>
                {currentClients.length === 0 && (
                    <p>No results</p>
                )}
            {currentClients.map((client) => (
                <Card key={client.client_id} sx={{ maxWidth: 1100, marginBottom: 2, marginTop: 3 }}>
                    <CardContent
                        onClick={() => navigate(`/my-clients/${client.client_id}`, { state: { user_id, client } })}
                        style={{ cursor: 'pointer' }}
                    >
                        <Typography variant="h5" component="div" sx={{ color: 'purple' }}>
                            {client.first_name} {client.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Click for client details
                        </Typography>
                    </CardContent>
                    <Button 
                        color="primary" 
                        onClick={() => handleMessageBox(client.client_id, client.first_name)} 
                        style={{ margin: '0 0 15px 15px' }}
                        variant='contained'
                    >
                        Message
                    </Button>
                </Card>
            ))}
                {isPendingApproval && (
                <Dialog
                    open={isPendingApproval}
                    onClose={() => setIsPendingApproval(false)}
                >
                    <DialogTitle>Approval Pending</DialogTitle>
                    <DialogContent>
                        <Typography>Your coach submission is still being reviewed.</Typography>
                    </DialogContent>
                </Dialog>
                )}
            </div>
            <div className='message-box' style={{ position: 'fixed', bottom: 20, right: 30, width: '25%' }}>
                {selectedClient && showMessageBox && renderMessageBox()}
            </div>
        </div>
    );
}