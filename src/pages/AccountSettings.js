import React, { useEffect, useState, useContext } from 'react';
import { TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const AccountSettings = () => {
  const user_id = parseInt(localStorage.getItem('userId'));
  const navigate = useNavigate();
  const {logout } = useContext(AuthContext);

  const [accountInfo, setAccountInfo] = useState([]);
  const [inputErrors, setInputErrors] = useState({first_name: '', last_name: '', email:'', phone: '', currentPassword: '', newPassword: '', confirmNewPassword: ''})
  const [hasError, setHasError] = useState({first_name: false, last_name: false, email:false, phone: false, currentPassword: false, newPassword: false, confirmNewPassword: false})
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const [formDisabled, setFormDisabled] = useState(true);

  // states for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // States for account deletion
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState('');
  const [deleteAccountSuccess, setDeleteAccountSuccess] = useState('');

  useEffect(() => {
    axios.post(`${baseUrl}/api/account/get-account-info`, {userId: user_id})
      .then((response) => {
        setAccountInfo(response.data);
      })
      .catch((error) => {
        setErrorMessage(error.data ? error.data.message : 'Error reaching server');
    });
  }, [user_id])

  const handleChange = (e, field) => {
    setAccountInfo({...accountInfo, [field]: e.target.value})
    setInputErrors({...inputErrors, [field]: ''})
    setHasError({...hasError, [field]: false})
    setFormDisabled(false)
  }
  const handleSubmit = () => {
    if(accountInfo.first_name === ""){
      setInputErrors({...inputErrors, first_name: 'First Name is required'});
      setHasError({...hasError, first_name: true})
      return;
    }
    else if(accountInfo.last_name === ""){
      setInputErrors({...inputErrors, last_name: 'Last Name is required'});
      setHasError({...hasError, last_name: true})
      return;
    }else if(accountInfo.email === ""){
      setInputErrors({...inputErrors, email: 'Email is required'});
      setHasError({...hasError, email: true})
      return;
    }
    else if(accountInfo.phone === ""){
      setInputErrors({...inputErrors, phone: 'Phone Number is required'});
      setHasError({...hasError, phone: true})
      return;
    }
    else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(accountInfo.email)){
      setInputErrors({...inputErrors, email: 'Incorrect email format'});
      setHasError({...hasError, email: true})
      return;
    }
    else if(!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(accountInfo.phone)){
      setInputErrors({...inputErrors, phone: 'Incorrect phone number format'});
      setHasError({...hasError, phone: true})
      return;
    }

    const reqBody = {...accountInfo, userId: user_id}
    axios.post(`${baseUrl}/api/account/update-account-info`, reqBody)
      .then((response) => {
        setErrorMessage(null)
        setSuccessMessage(response.data.message);
      })
      .catch((error) => {
        setSuccessMessage(null)
        setErrorMessage(error.data ? error.data.message : 'Error reaching server');
    });
  }
  // Function to handle password change
  const handleChangePassword = async () => {
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if(currentPassword === ""){
      setInputErrors({...inputErrors, currentPassword: 'Current password is required'});
      setHasError({...hasError, currentPassword: true})
      return;
    }
    else if(newPassword === ""){
      setInputErrors({...inputErrors, newPassword: 'New password is required'});
      setHasError({...hasError, newPassword: true})
      return;
    }else if(confirmNewPassword === ""){
      setInputErrors({...inputErrors, confirmNewPassword: 'Confirm new password is required'});
      setHasError({...hasError, confirmNewPassword: true})
      return;
    }else if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/account/change-password`, {
        currentPassword,
        newPassword,
        userId: user_id
      });
      setPasswordChangeSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.log(error)
      // Handle error response from the backend
      setPasswordChangeError(error.response.data ? error.response.data.message : 'Error reaching server');
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
  
    try {
      const response = await axios.post(`${baseUrl}/api/account/delete-account`, {
        userId: user_id,
        reason: deleteReason
      });
      console.log("Response from server:", response.data);
      setDeleteAccountSuccess(response.data.message);
      logout();
      navigate('/');
    } catch (error) {
      console.log("Error in account deletion:", error.response ? error.response.data : error);
      setDeleteAccountError(error.response.data.message);
    }
    setOpenDeleteDialog(false);
  };


  return (
    <div className="account-settings-page">
      <h1> Account Settings</h1>
      <div style={{ display: 'inline-flex'}}>
        <h2 style={{ fontWeight: 'normal', margin: '0'}}>General</h2>
        <h2 style={{ fontWeight: 'normal', margin: '0 0 30px 310px'}}>Contact Info</h2>
      </div>
      <br></br>
      <TextField
        InputLabelProps={{ shrink: true}}
        label="First Name"
        value={accountInfo.first_name}
        onChange={(e) => handleChange(e, 'first_name')}
        error={hasError.first_name}
        helperText={inputErrors.first_name}
        sx={{ margin: '0 140px 30px 0', width: '250px'}}
        variant='filled'
      />
      <TextField
        InputLabelProps={{ shrink: true}}
        label="Email"
        value={accountInfo.email}
        onChange={(e) => handleChange(e, 'email')}
        error={hasError.email}
        helperText={inputErrors.email}
        sx={{width: '300px'}}
        variant='filled'
      />
      <br></br>
      <TextField
        InputLabelProps={{ shrink: true}}
        label="Last Name"
        value={accountInfo.last_name}
        onChange={(e) => handleChange(e, 'last_name')}
        error={hasError.last_name}
        helperText={inputErrors.last_name}
        sx={{ margin: '0 140px 30px 0', width: '250px'}}
        variant='filled'
      />
      <TextField
        InputLabelProps={{ shrink: true}}
        label="Phone Number"
        value={accountInfo.phone}
        onChange={(e) => handleChange(e, 'phone')}
        error={hasError.phone}
        helperText={inputErrors.phone}
        sx={{width: '300px'}}
        variant='filled'
      />
      <br></br>
      <Button variant='contained' onClick={handleSubmit} disabled={formDisabled}>
        Save Changes
      </Button>
      <div style={{ width: '40%'}}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </div>
       {/* Reset Password Section */}
       <div>
        <h2 style={{ fontWeight: 'normal'}}>Reset Password</h2>
      </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value)
            setInputErrors({...inputErrors, currentPassword: ''})
            setHasError({...hasError, currentPassword: false})
          }}
          sx={{ margin: '0 140px 30px 0', width: '250px' }}
          variant='filled'
          error={hasError.currentPassword}
          helperText={inputErrors.currentPassword}
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value)
            setInputErrors({...inputErrors, newPassword: ''})
            setHasError({...hasError, newPassword: false})
          }}
          sx={{ margin: '0 140px 30px 0', width: '250px' }}
          variant='filled'
          error={hasError.newPassword}
          helperText={inputErrors.newPassword}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value)
            setInputErrors({...inputErrors, confirmNewPassword: ''})
            setHasError({...hasError, confirmNewPassword: false})
          }}
          sx={{ margin: '0 140px 20px 0', width: '250px' }}
          variant='filled'
          error={hasError.confirmNewPassword}
          helperText={inputErrors.confirmNewPassword}
        />
        <Button onClick={handleChangePassword} variant='contained' sx={{ marginBottom: '20px' }}>Change Password</Button>
        </div>
        <div style={{ width: '40%'}}>
          {passwordChangeError && <Alert severity="error">{passwordChangeError}</Alert>}
          {passwordChangeSuccess && <Alert severity="success">{passwordChangeSuccess}</Alert>}
        </div>
      

      {/* Delete Account Section */}
      <Button variant="contained" color="error" onClick={() => setOpenDeleteDialog(true)} sx={{ marginTop: '20px' }}>
        Delete Account
      </Button>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. Please enter your reason for deleting the account.
          </DialogContentText>
          <TextField autoFocus margin="dense" label="Reason" fullWidth variant="standard" onChange={(e) => setDeleteReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
      <div style={{ width: '40%'}}>
        {deleteAccountSuccess && <Alert severity="success">{deleteAccountSuccess}</Alert>}
        {deleteAccountError && <Alert severity="error">{deleteAccountError}</Alert>}
      </div>
    
    </div>
  );
};

export default AccountSettings;
