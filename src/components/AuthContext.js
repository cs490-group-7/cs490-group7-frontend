import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('userToken') ? true : false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);
  useEffect(() => {
    // Check for token in local storage
    try {
        const token = localStorage.getItem('userToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          //No authentication token found
        }
        const userType = localStorage.getItem('userType');
        if (userType){
          setUserType(userType);
        }
    } catch (err) {
        setError(err.message);
        console.error('Error reading token from localStorage:', err);
    }
    setLoading(false);
  }, []);

  const login = (token, userType) => {
    try {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userType', userType);
        setIsAuthenticated(true);
        setUserType(userType);
        console.log('Login function called, user authenticated, token');
    } catch (err) {
        setError(err.message);
        console.error('Error during login:', err);
    }
    
  };

  const logout = () => {
    try {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        console.log('Logout function called, user logged out');
      } catch (err) {
        setError(err.message);
        console.error('Error during logout:', err);
      }
    };  
  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
