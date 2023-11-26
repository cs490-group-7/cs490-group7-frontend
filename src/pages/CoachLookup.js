import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, Alert, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function CoachLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  // State for filters
  const [experienceFilter, setExperienceFilter] = useState('');
  const [specializationsFilter, setSpecializationsFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);

  const navigate = useNavigate();

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

  const handleManualSearch = () => {
    // Backend call for manual search with filters
    const filters = {
      experience: experienceFilter,
      specializations: specializationsFilter,
      city: cityFilter,
      state: stateFilter,
      price: priceFilter,
    };

    axios.post(`${baseUrl}/api/users/manual-search`, { filters })
      .then(response => {
        setSearchResults(response.data.coaches);
      })
      .catch(error => {
        console.error('Error fetching manual search results:', error);
      });
  };

  const handleCoachDetails = (coach) => {
    // Backend call for coach details
    axios.post(`${baseUrl}/api/users/coach-details`, { fname: coach.first_name, lname: coach.last_name, userId: coach.id })
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
        {/* Filters */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button variant="contained" onClick={handleManualSearch}>
              Search
            </Button>
          </Box>
          {/* Additional filters */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              id="experienceFilter"
              label="Experience"
              variant="outlined"
              sx={{ width: '20%' }}
              value={experienceFilter}
              onChange={(event) => setExperienceFilter(event.target.value)}
            />
            <TextField
              id="specializationsFilter"
              label="Specializations"
              variant="outlined"
              sx={{ width: '20%' }}
              value={specializationsFilter}
              onChange={(event) => setSpecializationsFilter(event.target.value)}
            />
            <TextField
              id="cityFilter"
              label="City"
              variant="outlined"
              sx={{ width: '20%' }}
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
            />
            <TextField
              id="stateFilter"
              label="State"
              variant="outlined"
              sx={{ width: '20%' }}
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value)}
            />
            <TextField
              id="priceFilter"
              label="Price"
              variant="outlined"
              sx={{ width: '20%' }}
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
            />
          </Box>
        </Grid>
        {/* Search results box with pagination */}
        <Grid item xs={12}>
          {displayedResults.length > 0 ? (
            <>
              {displayedResults.map((coach, index) => (
                <Card key={index} variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                  <Typography
                    variant="h6"
                    onClick={() => handleCoachDetails(coach)}
                    style={{ cursor: 'pointer' }}
                  >
                    {`${coach.first_name} ${coach.last_name}`}
                  </Typography>
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

      {/* Coach details dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Coach Details</DialogTitle>
        <DialogContent>
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
