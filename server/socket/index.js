/**
 * Socket.IO Setup and Configuration
 * Main entry point for Socket.IO initialization
 */

const { Server } = require('socket.io');
const socketConfig = require('../config/socket.config');
const socketAuthMiddleware = require('./socketAuth');
const { handleConnection } = require('./socketHandlers');

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {SocketIO} Socket.IO server instance
 */
const initializeSocket = (httpServer) => {
  // Create Socket.IO server with configuration
  const io = new Server(httpServer, socketConfig);

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Handle client connections
  io.on('connection', (socket) => {
    handleConnection(socket, io);
  });

  console.log('Socket.IO initialized successfully');
  
  return io;
};

/**
 * Get Socket.IO instance (for use in other parts of the app)
 */
let ioInstance = null;

const setIOInstance = (io) => {
  ioInstance = io;
};

const getIOInstance = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return ioInstance;
};

module.exports = {
  initializeSocket,
  setIOInstance,
  getIOInstance,
};
