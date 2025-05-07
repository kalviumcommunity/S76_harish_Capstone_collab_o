// AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // adjust the path if needed

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    //   setUserProfile({ name: 'John Doe' });
    } else {
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, setIsAuthenticated, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
