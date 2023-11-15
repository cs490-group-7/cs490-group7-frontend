import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Check for token in local storage
    try {
        const token = localStorage.getItem('userToken');
        if (token) {
        setIsAuthenticated(true);
        console.log('User is authenticated (token found)');
        } else {
            console.log('No authentication token found');
        }
    } catch (err) {
        setError(err.message);
        console.error('Error reading token from localStorage:', err);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
        localStorage.setItem('userToken', token);
        setIsAuthenticated(true);
        console.log('Login function called, user authenticated, token');
    } catch (err) {
        setError(err.message);
        console.error('Error during login:', err);
    }
    
  };

  const logout = () => {
    try {
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
        console.log('Logout function called, user logged out');
      } catch (err) {
        setError(err.message);
        console.error('Error during logout:', err);
      }
    };  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
