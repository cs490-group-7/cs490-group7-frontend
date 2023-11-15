import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import { AuthContext } from './AuthContext';

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, error } = useContext(AuthContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async() => {
    try {
      handleClose();
      logout();
      console.log('Logout initiated');
      navigate('/login');
    } catch (err) {
      console.error('Logout Error:', err.message);
    }
  };
  {error && <div className="error">{error}</div>}

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ width: '60%', marginLeft: '20%', fontWeight: 'bold', borderWidth: '2px'}}>
        Log Out
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to logout?"}
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
