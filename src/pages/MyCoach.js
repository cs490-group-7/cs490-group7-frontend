import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Grid } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyCoachClient() {
    const location = useLocation();
    const { user_id } = location.state || { user_id: false };
    const navigate = useNavigate();

    const [currentCoach, setCurrentCoach] = useState([]);
    const [hasCoach, setHasCoach] = useState();
    const [requestPending, setRequestPending] = useState();

    // Coach Removal Components
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
    const [removalReason, setRemovalReason] = useState('');

    useEffect(() => {
      axios.post(`${baseUrl}/api/coach/get-current-coach`, { userId: user_id })
        .then((response) => {
          setCurrentCoach(response.data);
          console.log(response.data);
          if (response.data.accepted === 1){
            setHasCoach(true);
          }
          else{
            setHasCoach(false);
          }
          if (response.data.pending === 1){
            setRequestPending(true);
          }
          else{
            setRequestPending(false);
          }
          
        })
        .catch((error) => {
          console.error('Error fetching coach data:', error);
        });
    }, [user_id]);

    const handleRemoveCoach = () => {
      setRemoveDialogOpen(true);
    };
  
    const handleRemoveDialogClose = () => {
      setRemoveDialogOpen(false);
      setRemovalReason('');
    };

    const handleRemoveSubmit = () => {
        // Temporary display reason
        // alert("Removal Reason: " + removalReason)
        axios.post(`${baseUrl}/api/coach/removal-reason`, { userId: user_id, coachId: currentCoach.coach_id, reason: removalReason})
        .then((response) => {
          
        })
        .catch((error) => {
          console.error('Error saving removal reason:', error);
        });

        axios.post(`${baseUrl}/api/coach/remove-coach`, { userId: user_id })
        .then((response) => {
          
        })
        .catch((error) => {
          console.error('Error removing coach:', error);
        });
        setHasCoach(false);
        handleRemoveDialogClose();
      };

  // State for the message input
  const [messageInput, setMessageInput] = useState('');

  // State for displaying messages
  const [messages, setMessages] = useState([]);

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
      <Typography variant="h5" style={{fontWeight: 'bold'}} >Message Your Coach:</Typography>
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
    
        <Box mb={1}>
          <Typography
            variant="body1"
            component="div"
          >
            Messages go here
          </Typography>
        </Box>
     
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

// Render coach details box
const renderCoachDetailsBox = () => (
    <Box style={{ height: '600px', position: 'relative', border: '2px solid rgba(0,0,0,0.10)', borderRadius: '15px', overflowY: 'auto' }}>
      {/* Dark blue box */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '20%',
          background: 'darkblue', 
          zIndex: 1, 
        }}
      />
      {/* Circle for Coach pfp */}
      <Box
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',  
          transform: 'translateX(-50%)', 
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: '#ccc',
          zIndex: 2, 
        }}
      />
      {/* Coach details */}
      <Box p={2} style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 3 }}>
        {/* Replace City and Stae with coach details */}
        <Typography variant="h5" style={{fontWeight: 'bold', textAlign: 'center'}}>{currentCoach.first_name} {currentCoach.last_name}</Typography>
        <Typography variant="body1" style={{ textAlign: 'center' }}>Specializes in {currentCoach.specializations}</Typography>
        <Typography variant="body1" style={{ textAlign: 'center' }}>{currentCoach.experience} years of experience</Typography>
        <br></br>
        <Typography variant="body1" style={{ textAlign: 'center' }}>{currentCoach.city}, {currentCoach.state}</Typography>
        <Typography variant="body1" style={{ textAlign: 'center' }}>${currentCoach.price}/hour</Typography>
        <br></br>
        <br></br>
        <Typography variant="body1" style={{ textAlign: 'center' }}> Stay updated with your coach</Typography>
      </Box>
      {/* Remove Coach button */}
      <Button variant="contained" style={{backgroundColor:'white', color:'red', zIndex: '4', marginTop: '90%', left: "37%"}} onClick={handleRemoveCoach}>
          Remove Coach
        </Button>
    </Box>
      );
  
  return (
    <div className="my-coach-client-page">
      <h1>My Coach</h1>
      <Grid container spacing={3}>
        {/* Coach details box */}
        {(hasCoach === false) &&
        <div>
          <Box p={4} style={{ position: 'relative', overflowY: 'auto' }}>
            <Typography variant="h5" style={{ textAlign: 'center' }}>You do not have a coach</Typography>
            <br></br>
            {(requestPending === false) && 
            <Typography variant="body1" style={{}}>
              You can request a coach in the <br/>
              <a className={location.pathname === '/coach-lookup' ? 'active' : ''} onClick={() => navigate("/coach-lookup", { state: location.state })} style={{cursor: "pointer", color: "blue", textDecoration: "underline"}}>Coach Lookup</a> page
            </Typography>
            }
            {(requestPending === true) && 
            <Typography variant="body1" style={{ }}>Your coach request is still pending</Typography>
            }
            
          </Box>
        </div>}
        <Grid item xs={5}>
            {(hasCoach === true) && renderCoachDetailsBox()}
          

      {/* Remove Coach Dialog */}
      <Dialog open={isRemoveDialogOpen} onClose={handleRemoveDialogClose}>
        <DialogTitle>Remove Coach</DialogTitle>
        <DialogContent sx={{ width: '400px'}}>
          <TextField
            label="Reason for removal"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={removalReason}
            onChange={(e) => setRemovalReason(e.target.value)}
            sx={{ marginTop: '10px'}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveDialogClose}>Cancel</Button>
          <Button onClick={handleRemoveSubmit} variant="contained" color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

        </Grid>
        {/* Message box */}
        <Grid item xs={7}>
          {(hasCoach === true) && renderMessageBox()}
        </Grid>
      </Grid>
    </div>
  );
}