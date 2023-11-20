import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, Link, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function CoachLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const [selectedCoach, setSelectedCoach] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSearch = () => {
    // Backend call for initial search
    axios.post(`${baseUrl}/api/users/initial-search`)
      .then(response => {
        setSearchResults(response.data.coaches);
      })
      .catch(error => {
        console.error('Error fetching coach search results:', error);
      });
  };

  const handleCoachDetails = (fname, lname) => {
    // Backend call for coach details
    axios.post(`${baseUrl}/api/users/coach-details`, { fname, lname })
      .then(response => {
        setSelectedCoach(response.data.coaches[0]); // Assuming only one result is expected
        setOpenDialog(true);
      })
      .catch(error => {
        console.error('Error fetching coach details:', error);
      });
  };

  useEffect(() => {
    // Fetch initial search results when the component mounts
    handleSearch();
  }, [currentPage]); // Include currentPage as a dependency to re-run the effect when the page changes

  const startIdx = (currentPage - 1) * resultsPerPage;
  const endIdx = startIdx + resultsPerPage;

  const displayedResults = searchResults.slice(startIdx, endIdx);

  return (
    <div className="coach-lookup-page">
      <h1>Coach Lookup</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Search input and button */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              id="searchQuery"
              label="Search for coaches"
              variant="outlined"
              sx={{ width: '70%' }}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {/* Search results box with pagination */}
          {displayedResults.length > 0 ? (
            <>
              {displayedResults.map((coach, index) => (
                <Card key={index} variant="outlined" sx={{ padding: 2, marginBottom: 2, cursor: 'pointer' }} onClick={() => handleCoachDetails(coach.first_name, coach.last_name)}>
                  <Typography variant="h6">{`${coach.first_name} ${coach.last_name}`}</Typography>
                  {/* Add more coach details as needed */}
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

      {/* Coach Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Coach Details</DialogTitle>
        <DialogContent>
          {selectedCoach && (
            <>
              <Typography>{`Experience: ${selectedCoach.experience}`}</Typography>
              <Typography>{`Specializations: ${selectedCoach.specializations}`}</Typography>
              <Typography>{`City: ${selectedCoach.city}`}</Typography>
              <Typography>{`State: ${selectedCoach.state}`}</Typography>
              <Typography>{`Availability: ${selectedCoach.availability}`}</Typography>
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
