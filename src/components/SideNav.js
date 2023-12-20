import React from 'react';
import './SideNav.css';
import { Navigate, redirect, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import LogoutButton from './LogoutButton';
import { useContext } from 'react';
import { Button } from '@mui/material';

export default function SideNav() {
  const { isAuthenticated, userType } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="side-nav">
      <h2 className="title">TrackMeet</h2>
      {!isAuthenticated && (
        <a className={location.pathname === '/' ? 'active' : ''} onClick={() => navigate("/")}>Home</a>
      )}
      {isAuthenticated && (
        <>
      <a
        className={location.pathname === '/' ? 'active' : ''}
        onClick={() => navigate("/", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        Home
      </a>
      <a
        className={location.pathname === '/dashboard' ? 'active' : ''}
        onClick={() => navigate("/dashboard", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        Dashboard
      </a>
      <a
        className={location.pathname === '/my-progress' ? 'active' : ''}
        onClick={() => navigate("/my-progress", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        My Progress
      </a>
      <a
        className={location.pathname === '/workouts' ? 'active' : ''}
        onClick={() => {location.state.client = false; navigate("/workouts", { state: location.state })}}
        style={{ cursor: 'pointer' }}
        >
        Workouts
      </a>
      {userType !== 'Client' && (
      <a
        className={location.pathname.substring(0,11) === '/my-clients' ? 'active' : ''}
        onClick={() => navigate("/my-clients", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        My Clients
      </a>
      )}
      {userType !== 'Coach' && (
      <a
        className={location.pathname === '/my-coach' ? 'active' : ''}
        onClick={() => navigate("/my-coach", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        My Coach
      </a>
      )}
      <a
        className={location.pathname === '/coach-lookup' ? 'active' : ''}
        onClick={() => navigate("/coach-lookup", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        Coach Lookup
      </a>
      <a
        className={location.pathname === '/account-settings' ? 'active' : ''}
        onClick={() => navigate("/account-settings", { state: location.state })}
        style={{ cursor: 'pointer' }}
        >
        Account Settings
      </a>
      {userType === 'Admin' && (
          <a 
            className={location.pathname === '/admin' ? 'active' : ''}
            onClick={() => navigate("/admin", { state: location.state })}
            style={{ cursor: 'pointer' }}
            >
            Admin Page
          </a>
      )}
        <LogoutButton />
        </>
        )}
        {!isAuthenticated && (
          <Button onClick={() => navigate("/login")} variant="outlined" sx={{ width: '60%', marginLeft: '20%', fontWeight: 'bold', borderRadius: 1, minWidth: 30, minHeight: 0, color: "#00008b", borderColor: "#00008b", borderWidth: 2, '&:hover': { backgroundColor: "#E0E0F1", borderColor: "#00008b", borderWidth: 2 } }} >
            LOG IN  
          </Button>
        )}
      </div>
    );
  }