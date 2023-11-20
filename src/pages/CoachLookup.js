import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, Link, Alert } from '@mui/material';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default function CoachLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  const handleSearch = () => {
    // TODO: Implement the backend call for coach search based on searchQuery
    // axios.get(`${baseUrl}/api/coaches?query=${searchQuery}&page=${currentPage}&perPage=${resultsPerPage}`)
    //   .then(response => {
    //     setSearchResults(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching coach search results:', error);
    //   });
    
    // For now, let's use mock data
    const mockData = [
      { id: 1, name: 'Coach 1' },
      { id: 2, name: 'Coach 2' },
      { id: 3, name: 'Coach 3' },
      { id: 4, name: 'Coach 4' },
      { id: 5, name: 'Coach 5' },
      // ... add more mock data as needed
    ];
    setSearchResults(mockData);
  };

  useEffect(() => {
    // Fetch initial search results when the component mounts
    handleSearch();
  }, [currentPage]); // Include currentPage as a dependency to re-run the effect when the page changes

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
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((coach) => (
                <Card key={coach.id} variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                  <Typography variant="h6">{coach.name}</Typography>
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
                  disabled={searchResults.length < resultsPerPage}
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
    </div>
  );
}
