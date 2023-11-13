import React from 'react';
import './SideNav.css';
import { useLocation } from 'react-router-dom';

export default function SideNav() {
  const location = useLocation();

  return (
    <div className="side-nav">
      <h2 className="title">Fitness App</h2>
      <a
        className={location.pathname === '/login' ? 'active' : ''} href="/login">
        Log In
      </a> 
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
    </div>
  );
}
