import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Grid } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function MyCoachClient() {
    const location = useLocation();
    const user_id = parseInt(localStorage.getItem('userId'));
    const navigate = useNavigate();

    const [currentCoach, setCurrentCoach] = useState({});
    const [currentCoachFName, setCurrentCoachFName] = useState(null);
    const [hasCoach, setHasCoach] = useState();
    const [requestPending, setRequestPending] = useState();
    const [errorMessage, setErrorMessage] = useState(null);
    const [messageClosed, setMessageClosed] = useState(true);

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
  const [showMessageBox, setShowMessageBox] = useState(false);

  const handleMessageBox = (coach_id, coachFirstName) => {
    setMessageClosed(false);
    setCurrentCoach({ coach_id: coach_id, first_name: coachFirstName }); // Set the selected coach as an object
  
    axios.post(`${baseUrl}/api/chat/get-messages`, { coach_id: coach_id, client_id: user_id })
    .then((response) => {
        setMessages(response.data); // Update the messages state
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  };  

// Function to handle sending a message
const handleSendMessage = () => {
  if (messageInput.trim() !== '' && currentCoach) {
      // Prepare the message data
      const messageData = {
          user_id: user_id,
          user_type: 'Client',
          coach_id: currentCoach.coach_id,
          client_id: user_id,
          message: messageInput,
      };

      // Make a POST request to the '/send-message' endpoint
      axios.post(`${baseUrl}/api/chat/send-message`, messageData)
      .then((response) => {
          if (response.data.message === 'Message saved successfully.') {
              setMessageInput(''); // Clear the message input

              // Fetch the messages for the selected client
              axios.post(`${baseUrl}/api/chat/get-messages`, { coach_id: currentCoach.coach_id, client_id: user_id })
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

  // State for the interval ID
  const [intervalId, setIntervalId] = useState(null);

useEffect(() => {
  let interval = null;

  const getMessages = () => {
    axios.post(`${baseUrl}/api/chat/get-messages`, { coach_id: currentCoach.coach_id, client_id: user_id })
      .then((response) => {
          setMessages(response.data);
      })
      .catch((error) => {
          console.error('Error:', error);
    });
  }

  if (hasCoach && showMessageBox) {
      // Fetch the messages when the message box is opened
      getMessages();
      interval = setInterval(() => {
          getMessages();
      }, 5000); // Fetches messages every 5 seconds
  } else if (!showMessageBox && interval !== null) {
      // Clear the interval when the message box is closed
      clearInterval(interval);
  }

    // Save the interval ID
    setIntervalId(interval);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
}, [currentCoach.coach_id, user_id, hasCoach, showMessageBox]);

  // Function to handle "Enter" key press in the message input
  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
    handleSendMessage();
    }
  };

  // Render message box
const renderMessageBox = () => (
  <Box style={{ height: '650px', position: 'relative', border: '2px solid rgba(0,0,0,0.10)', borderRadius: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
  {/* Header */}
  <Box
  style={{
    background: '#f0f0f0', 
    padding: '8px',
  }}
  >
  <Typography variant="h5" style={{fontWeight: 'bold'}} >Message Your Coach:</Typography>
  <Button sx={{ float: 'right', borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '10px', color: "#00008b", '&:hover': { backgroundColor: "#E0E0F1" } }} onClick={() => setShowMessageBox(false)}>Close</Button>
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
  {messages.length > 0 ? (
    messages.map((message, index) => (
      <Box key={index} mb={1}>
          {message.from_coach ? (
              <>
                  <Typography variant="body1" component="div" color="purple">
                    {currentCoach.first_name}: {message.message}
                  </Typography>
              </>
          ) : (
              <Typography variant="body1" component="div" color="blue">
                  You: {message.message}
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

// Render coach details box
const renderCoachDetailsBox = () => (
  <Box style={{ height: '650px', position: 'relative', border: '2px solid rgba(0,0,0,0.10)', borderRadius: '15px', overflowY: 'auto' }}>
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
  {/* Coach details */}
  <Box p={2} style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 3 }}>
    {/* Replace City and Stae with coach details */}
    <Typography variant="h5" style={{fontWeight: 'bold', textAlign: 'center'}}>{currentCoach.first_name} {currentCoach.last_name}</Typography>
    <br></br>
    <Typography variant="body1" style={{ textAlign: 'center' }}>Specializes in {currentCoach.specializations}</Typography>
    <Typography variant="body1" style={{ textAlign: 'center' }}>{currentCoach.experience} years of experience</Typography>
    <br></br>
    <Typography variant="body1" style={{ textAlign: 'center' }}>{currentCoach.city}, {currentCoach.state}</Typography>
    <Typography variant="body1" style={{ textAlign: 'center' }}>${currentCoach.price}/hour</Typography>
    <br></br>
    <br></br>
    <Typography variant="body1" style={{ textAlign: 'center' }}> Stay updated with your coach:</Typography>
    <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: '0 auto', display: 'block', marginTop: '10px', backgroundColor: "#00008b", color: "#ffffff", '&:hover': { backgroundColor: "#4040A8" } }} onClick={() => setShowMessageBox(true)}>
      Message
    </Button>
    <Button color="error" sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: '0 auto', display: 'block', marginTop: '120px', backgroundColor: "#8C0044", color: "#ffffff", '&:hover': { backgroundColor: "#A94073" } }} onClick={handleRemoveCoach}>
      Remove Coach
    </Button>
  </Box>
  {/* Remove Coach button */}
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
        {(hasCoach === true) && 
          <>
            <Grid item xs={4}>
              {renderCoachDetailsBox()}
            </Grid>
            {/* Message box */}
            {showMessageBox && 
              <Grid item xs={8}>
                {renderMessageBox()}
              </Grid>
            }
          </>
        }
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
          <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '10px', color: "#00008b", '&:hover': { backgroundColor: "#E0E0F1" } }} onClick={handleRemoveDialogClose}>Cancel</Button>
          <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '10px', color: "#00008b", '&:hover': { backgroundColor: "#E0E0F1" } }} onClick={handleRemoveSubmit} variant="contained" color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
    </div>
  );
}