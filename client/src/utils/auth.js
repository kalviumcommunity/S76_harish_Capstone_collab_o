// Authentication utilities for session management
export const authUtils = {
  // Check if user is authenticated
  isUserAuthenticated: () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  },

  // Set remember me preference
  setRememberMe: (remember = true) => {
    localStorage.setItem('rememberMe', remember.toString());
  },

  // Get remember me preference
  getRememberMe: () => {
    return localStorage.getItem('rememberMe') === 'true';
  },

  // Clear all authentication data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
  },

  // Get user data from localStorage
  getUserData: () => {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
    };
  },

  // Set user data in localStorage
  setUserData: (userData) => {
    if (userData.token) localStorage.setItem('token', userData.token);
    if (userData.userId) localStorage.setItem('userId', userData.userId);
    if (userData.username) localStorage.setItem('username', userData.username);
    if (userData.email) localStorage.setItem('email', userData.email);
  }
};

export default authUtils;