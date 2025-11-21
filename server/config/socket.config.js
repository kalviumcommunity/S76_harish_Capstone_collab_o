/**
 * Socket.IO Configuration
 * Contains CORS settings and socket options
 */

module.exports = {
  cors: {
    origin: ['http://localhost:5173', 'https://freecoll.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  
  // Optional: Add more socket.io options here
  pingTimeout: 60000,
  pingInterval: 25000,
};
