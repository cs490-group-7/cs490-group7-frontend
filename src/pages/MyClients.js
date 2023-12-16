import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Card, CardContent, CardActions, Typography, AppBar, Toolbar, Link, Dialog, DialogTitle, DialogContent} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyClient() {
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };
    console.log("Location State:", location.state); // Log location.state
    console.log("User ID:" , user_id);
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
  const [showMessageBox, setShowMessageBox] = useState(false);
  // State for displaying messages
  const [messages, setMessages] = useState([]);

    // Modify the renderMessageBox function to update the state
    const handleMessageBox = () => {
        setShowMessageBox(!showMessageBox); // Toggle the state
    };

// Function to handle sending a message
const handleSendMessage = (client_id) => {
    if (messageInput.trim() !== '') {
        // Prepare the message data
        const messageData = {
            user_id: user_id,
            user_type: 'Coach',
            coach_id: user_id,
            client_id: client_id,
            message: messageInput,
        };

        // Make a POST request to the '/send-message' endpoint
        axios.post(`${baseUrl}/send-message`, messageData)
        .then((response) => {
            if (response.data.message === 'Message saved successfully.') {
                // Add the message to the messages array
                setMessages((messages) => [...messages, { from_coach: true, message: messageInput }]);
                setMessageInput('');
            } else {
                console.error('Error:', response.data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
};

useEffect(() => {
    // Fetch the messages when the component mounts
    axios.post(`${baseUrl}/get-messages`, { coach_id: user_id, client_id: selectedClient })
    .then((response) => {
        setMessages(response.data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}, [user_id, selectedClient]);

  // Function to handle "Enter" key press in the message input
    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
         alert("Message was " + messageInput);
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
            <Typography variant="h5" style={{fontWeight: 'bold'}} >Message Your Client:</Typography>
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
        {messages.map((message, index) => (
            <Box key={index} mb={1}>
                <Typography variant="body1" component="div">
                    {message.from_coach ? 'You: ' : 'Client: '}
                    {message.message}
                </Typography>
            </Box>
        ))}

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
            <div id="current-clients">
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
                        onClick={handleMessageBox} 
                        style={{ margin: '10px' }}
                    >
                        Message
                    </Button>
                    {showMessageBox && renderMessageBox()}
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
        </div>
    );
}