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
      <Button variant="outlined" onClick={handleClickOpen} sx={{ width: '60%', marginLeft: '20%', fontWeight: 'bold', borderRadius: 1, minWidth: 30, minHeight: 0, color: "#00008b", borderColor: "#00008b", borderWidth: 2, '&:hover': { backgroundColor: "#E0E0F1", borderColor: "#00008b", borderWidth: 2 } }}>
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
          <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '10px', color: "#00008b", '&:hover': { backgroundColor: "#E0E0F1" } }} onClick={handleClose}>Cancel</Button>
          <Button sx={{ borderRadius: 1, minWidth: 30, minHeight: 0, padding: 0.8, margin: 0.5, marginTop: '10px', color: "#00008b", '&:hover': { backgroundColor: "#E0E0F1" } }} onClick={handleLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;
