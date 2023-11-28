import React from 'react';
import './SideNav.css';
import { Navigate, redirect, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import LogoutButton from './LogoutButton';
import { useContext } from 'react';
import { Button } from '@mui/material';

export default function SideNav() {
  const { isAuthenticated } = useContext(AuthContext);
  console.log('SideNav, isAuthenticated:', isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="side-nav">
      <h2 className="title">Fit Fusion</h2>
      {!isAuthenticated && (
        <a className={location.pathname === '/' ? 'active' : ''} onClick={() => navigate("/")}>Home</a>
      )}
      {isAuthenticated && (
        <>
      <a
        className={location.pathname === '/dashboard' ? 'active' : ''}
        onClick={() => navigate("/dashboard", { state: location.state })}
        >
        Dashboard
      </a>
      <a
        className={location.pathname === '/my-progress' ? 'active' : ''}
        onClick={() => navigate("/my-progress", { state: location.state })}
        >
        My Progress
      </a>
      <a
        className={location.pathname === '/workouts' ? 'active' : ''}
        onClick={() => navigate("/workouts", { state: location.state })}
        >
        Workouts
      </a>
      <a
        className={location.pathname === '/my-coach-client' ? 'active' : ''}
        onClick={() => navigate("/my-coach-client", { state: location.state })}
        >
        My Coach/Clients
      </a>
      <a
        className={location.pathname === '/coach-lookup' ? 'active' : ''}
        onClick={() => navigate("/coach-lookup", { state: location.state })}
        >
        Coach Lookup
      </a>
      <a
        className={location.pathname === '/account-settings' ? 'active' : ''}
        onClick={() => navigate("/account-settings", { state: location.state })}
        >
        Account Settings
      </a>
        <LogoutButton />
        </>
        )}
        {!isAuthenticated && (
          <Button onClick={() => navigate("/login")} variant="outlined" sx={{ width: '60%', marginLeft: '20%', fontWeight: 'bold', borderWidth: '2px'}}>
            LOG IN  
          </Button>
        )}
      </div>
    );
  }