import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

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
          name: username,
          email: email,
          id: userId
        });
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      userProfile, 
      setUserProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};