/**
 * Socket Event Handlers
 * Handles all socket.io events and business logic
 */

const MessageModel = require('../model/Message');
const { verifyProposalParticipant } = require('../services/proposalAccess');

/**
 * Build chat message payload for consistent format
 * @param {Object} doc - Message document from database
 * @param {String} username - Sender username
 * @param {String} userId - Sender user ID
 * @returns {Object} Formatted chat message
 */
const buildChatPayload = (doc, username, userId) => ({
  _id: doc._id,
  proposalId: doc.proposalId,
  message: doc.message,
  sender: { id: userId, name: username },
  attachments: doc.attachments || [],
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

/**
 * Handle socket connection event
 * @param {Socket} socket - Socket.io socket instance
 * @param {SocketIO} io - Socket.io server instance
 */
const handleConnection = (socket, io) => {
  console.log('Socket connected:', socket.id, '| User:', socket.user.username);

  // Join room event
  socket.on('joinRoom', async ({ room }) => {
    await handleJoinRoom(socket, room);
  });

  // Leave room event
  socket.on('leaveRoom', ({ room }) => {
    handleLeaveRoom(socket, room);
  });

  // Chat message event
  socket.on('chatMessage', async ({ room, message }) => {
    await handleChatMessage(socket, io, room, message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    handleDisconnect(socket);
  });
};

/**
 * Handle joining a room
 * @param {Socket} socket - Socket.io socket instance
 * @param {String} room - Room name to join
 */
const handleJoinRoom = async (socket, room) => {
  console.log(`[JoinRoom] User ${socket.user.username} (${socket.user.id}) attempting to join room: ${room}`);
  
  if (!room) {
    console.error('[JoinRoom] Room name missing');
    socket.emit('chatError', { message: 'Room name is required' });
    return;
  }

  // Handle proposal-specific rooms
  if (room.startsWith('proposal_')) {
    const proposalId = room.replace('proposal_', '');
    console.log(`[JoinRoom] Verifying access to proposal: ${proposalId}`);
    
    const access = await verifyProposalParticipant(proposalId, socket.user.id);
    
    if (!access.allowed) {
      console.error(`[JoinRoom] Access denied for user ${socket.user.id} to proposal ${proposalId}:`, access.error);
      socket.emit('chatError', { 
        message: access.error || 'Access denied to this proposal room' 
      });
      return;
    }
    
    console.log(`[JoinRoom] Access granted - Role: ${access.role}`);
  }

  socket.join(room);
  console.log(`[JoinRoom] ✓ User ${socket.user.username} successfully joined room: ${room}`);
  
  // Optionally notify room members
  socket.to(room).emit('userJoined', {
    userId: socket.user.id,
    username: socket.user.username,
    room,
  });
};

/**
 * Handle leaving a room
 * @param {Socket} socket - Socket.io socket instance
 * @param {String} room - Room name to leave
 */
const handleLeaveRoom = (socket, room) => {
  if (!room) return;

  socket.leave(room);
  console.log(`User ${socket.user.username} left room: ${room}`);
  
  // Optionally notify room members
  socket.to(room).emit('userLeft', {
    userId: socket.user.id,
    username: socket.user.username,
    room,
  });
};

/**
 * Handle chat message
 * @param {Socket} socket - Socket.io socket instance
 * @param {SocketIO} io - Socket.io server instance
 * @param {String} room - Room name
 * @param {String} message - Message content
 */
const handleChatMessage = async (socket, io, room, message) => {
  console.log(`[ChatMessage] User ${socket.user.username} sending message to room: ${room}`);
  
  // Validate input
  if (!room || !message) {
    console.error('[ChatMessage] Missing room or message');
    socket.emit('chatError', { message: 'Room and message are required' });
    return;
  }

  // Only handle proposal rooms for chat messages
  if (!room.startsWith('proposal_')) {
    console.error('[ChatMessage] Invalid room type:', room);
    socket.emit('chatError', { message: 'Invalid room type for chat messages' });
    return;
  }

  const proposalId = room.replace('proposal_', '');
  const text = message.trim();
  
  if (!text) {
    console.error('[ChatMessage] Empty message');
    socket.emit('chatError', { message: 'Message cannot be empty' });
    return;
  }

  // Verify user access to proposal
  console.log(`[ChatMessage] Verifying access for user ${socket.user.id} to proposal ${proposalId}`);
  const access = await verifyProposalParticipant(proposalId, socket.user.id);
  if (!access.allowed) {
    console.error(`[ChatMessage] Access denied:`, access.error);
    socket.emit('chatError', { 
      message: access.error || 'Access denied to send messages in this proposal' 
    });
    return;
  }

  console.log(`[ChatMessage] Access granted - Role: ${access.role}`);

  try {
    // Save message to database
    const doc = await MessageModel.create({
      proposalId,
      senderId: socket.user.id,
      senderName: socket.user.username,
      message: text,
    });

    // Build and emit message payload to all room members
    const payload = buildChatPayload(doc, socket.user.username, socket.user.id);
    io.to(room).emit('chatMessage', payload);
    
    console.log(`[ChatMessage] ✓ Message sent successfully in room ${room} by ${socket.user.username}`);
  } catch (err) {
    console.error('[ChatMessage] Failed to persist message:', err);
    socket.emit('chatError', { 
      message: 'Failed to send message. Please try again.' 
    });
  }
};

/**
 * Handle socket disconnect
 * @param {Socket} socket - Socket.io socket instance
 */
const handleDisconnect = (socket) => {
  console.log('Socket disconnected:', socket.id, '| User:', socket.user.username);
  // Add any cleanup logic here if needed
};

module.exports = {
  handleConnection,
  buildChatPayload,
};
