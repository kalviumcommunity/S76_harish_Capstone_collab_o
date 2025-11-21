/**
 * Socket.IO Service
 * Provides access to Socket.IO instance across the application
 * This is a wrapper around the socket module for backward compatibility
 */

const { getIOInstance, setIOInstance } = require('../socket');

module.exports = {
  init: (io) => { 
    setIOInstance(io);
  },
  getIO: () => {
    try {
      return getIOInstance();
    } catch (err) {
      console.warn('Socket.IO not initialized:', err.message);
      return null;
    }
  },
};
