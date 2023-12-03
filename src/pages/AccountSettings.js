import React, { useEffect, useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const AccountSettings = () => {
  const location = useLocation();
  const { user_id } = location.state || { user_id: false };

  const [accountInfo, setAccountInfo] = useState([]);
  const [inputErrors, setInputErrors] = useState({first_name: '', last_name: '', email:'', phone: ''})
  const [hasError, setHasError] = useState({first_name: false, last_name: false, email:false, phone: false})
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const [formDisabled, setFormDisabled] = useState(true);

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
    console.log(accountInfo)
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
    </div>
  );
};

export default AccountSettings;
