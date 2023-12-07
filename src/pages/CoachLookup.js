import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const getAllStates = () => [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

export default function CoachLookup() {
  const location = useLocation();
  const { user_id } = location.state || { user_id: false };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [requestedCoaches, setRequestedCoaches] = useState([]);

  const [experience, setExperience] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

const handleSearch = () => {
  // Backend call for filtered search
  axios.post(`${baseUrl}/api/users/filtered-search`, {
    experience,
    specializations,
    city,
    state,
    maxPrice,
  })
    .then(response => {
      setSearchResults(response.data.coaches);
    })
    .catch(error => {
      console.error('Error fetching filtered coach search results:', error);
    });
};

  const handleCoachDetails = (coach) => {
    // Backend call for coach details
    axios.post(`${baseUrl}/api/users/coach-details`, { fname: coach.first_name, lname: coach.last_name, userId: coach.id })
      .then(response => {
        setSelectedCoach(response.data.coaches[0]); 
        setOpenDialog(true);
      })
      .catch(error => {
        console.error('Error fetching coach details:', error);
      });
  };

  const handleRequestCoach = (coach) => {
  // Prevent users from requesting themselves
  if (coach.id === user_id) {
    alert("You can't request yourself as a coach.");
    return;
  }

  // Check if the coach has already been requested
  if (requestedCoaches.includes(coach.id)) {
    alert("You have already requested this coach.");
    return;
  }

  // Backend call to request coach
  axios.post(`${baseUrl}/api/users/request-coach`, { coachId: coach.id, clientId: user_id })
    .then(response => {
      // Update the list of requested coaches
      setRequestedCoaches([...requestedCoaches, coach.id]);
      alert("Coach requested successfully!");
    })
    .catch(error => {
      console.error('Error requesting coach:', error);
    });
};

  useEffect(() => {
    // Fetch initial search results when the component mounts
    handleSearch();
  }, [currentPage, experience, specializations, city, state, maxPrice]);

  const startIdx = (currentPage - 1) * resultsPerPage;
  const endIdx = startIdx + resultsPerPage;

  const displayedResults = searchResults.slice(startIdx, endIdx);

  return (
    <div className="coach-lookup-page">
      <h1>Coach Lookup</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
           {/* Filter options */}
          <h3 style={{ marginTop: 0}}>Filter:</h3>
          <Box display="flex" justifyContent="space-between">
            <TextField
              id="experience"
              label="Min Experience (years)"
              variant="outlined"
              value={experience}
              required type = "number"
              onChange={(event) => setExperience(event.target.value)}
            />
             <Select
              label="Specializations"
              id="specializations"
              value={specializations}
              onChange={(event) => setSpecializations(event.target.value)}
              displayEmpty 
             >
            <MenuItem value="">Specializations</MenuItem>
              <MenuItem value="Losing Weight">Losing Weight</MenuItem>
              <MenuItem value="Gaining Weight">Gaining Weight</MenuItem>
              <MenuItem value="Building Muscle">Building Muscle</MenuItem>
              <MenuItem value="Getting Stronger">Getting Stronger</MenuItem>
              <MenuItem value="Getting Faster">Getting Faster</MenuItem>
            </Select>
            <TextField
              id="city"
              label="City"
              variant="outlined"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
              <Select
                label="State"
                id="state"
                value={state}
                onChange={(event) => setState(event.target.value)}
                displayEmpty 
              >
                <MenuItem value="">State</MenuItem>
                {getAllStates().map((stateName) => (
                  <MenuItem key={stateName} value={stateName}>
                    {stateName}
                  </MenuItem>
                ))}
              </Select>
            <TextField
              id="maxPrice"
              label="Max Price"
              variant="outlined"
              value={maxPrice}
              required type = "number"
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </Box>
          </Grid>
        <Grid item xs={12}>
          <h4 style={{ marginTop: 0}}>Click the coach for more details</h4>
          {/* Search results box with pagination */}
          {displayedResults.length > 0 ? (
            <>
              {displayedResults.map((coach, index) => (
                <Card key={index} variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                  <Typography
                    variant="h6"
                    onClick={() => handleCoachDetails(coach)}
                    style={{ cursor: 'pointer', fontSize:'24px' }}
                  >
                    {`${coach.first_name} ${coach.last_name}`}
                  </Typography>
                  <Button onClick={() => handleRequestCoach(coach)} variant='contained' sx={{ marginTop: '10px'}}>
                    Request Coach
                  </Button>
                </Card>
              ))}
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                >
                  Previous Page
                </Button>
                <Typography sx={{ marginX: 2 }}>{currentPage}</Typography>
                <Button
                  disabled={searchResults.length <= endIdx}
                  onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                >
                  Next Page
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2">No results found.</Typography>
          )}
        </Grid>
      </Grid>

      {/* Coach details dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Coach Details:</DialogTitle>
        <DialogContent sx={{ width: '400px'}}>
          {selectedCoach && (
            <>
              <Typography>Years of Experience: {selectedCoach.experience}</Typography>
              <Typography>Specializations: {selectedCoach.specializations}</Typography>
              <Typography>City: {selectedCoach.city}</Typography>
              <Typography>State: {selectedCoach.state}</Typography>
              <Typography>Price Per Hour: {selectedCoach.price}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
