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
      <a className={location.pathname === '/' ? 'active' : ''} href="/">
        Home
      </a>
      <a
        className={location.pathname === '/my-progress' ? 'active' : ''}
        href="/my-progress"
        >
        My Progress
      </a>
      <a
        className={location.pathname === '/workouts' ? 'active' : ''}
        href="/workouts"
        >
        Workouts
      </a>
      <a
        className={location.pathname === '/my-coach-client' ? 'active' : ''}
        href="/my-coach-client"
        >
        My Coach/Clients
      </a>
      <a
        className={location.pathname === '/coach-lookup' ? 'active' : ''}
        href="/coach-lookup"
        >
        Coach Lookup
      </a>
      <a
        className={location.pathname === '/account-settings' ? 'active' : ''}
        href="/account-settings"
        >
        Account Settings
      </a>
      {isAuthenticated ?
        <LogoutButton />
      : 
      <Button onClick={() => navigate("/login")} variant="outlined" sx={{ width: '60%', marginLeft: '20%', fontWeight: 'bold', borderWidth: '2px'}}>
        LOG IN  
      </Button>
      }
    </div>
  );
}
