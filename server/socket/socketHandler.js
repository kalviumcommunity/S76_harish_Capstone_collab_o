module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a specific room using the proposalId as the roomId
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle sending messages to a specific room
    socket.on('message', ({ roomId, message }) => {
      const broadcastMessage = {
        message,
        isSender: false, // Mark the message as received for others
        createdAt: new Date(),
      };

      // Emit the message to all clients in the room
      io.to(roomId).emit('message', broadcastMessage);

      console.log(`Message sent to room ${roomId}:`, message);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};