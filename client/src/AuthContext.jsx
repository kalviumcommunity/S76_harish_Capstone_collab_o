import React, { createContext, useState, useEffect } from 'react';

// Create the context with default values to prevent 'undefined' errors
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userProfile: null,
  setUserProfile: () => {},
  loading: true
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated on mount
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      const userId = localStorage.getItem('userId');
      
      if (token) {
        setIsAuthenticated(true);
        setUserProfile({
          name: username || '',
          email: email || '',
          id: userId || ''
        });
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Create value object
  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    userProfile,
    setUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};