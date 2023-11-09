import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
        Log Out
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Logout? Are you sure you want to logout?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;
