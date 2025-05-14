// const Message = require('../models/Message');
// const Conversation = require('../models/Conversation');

// const socketHandler = (io) => {
//   io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
    
//     // Join a specific conversation room
//     socket.on('joinRoom', ({ conversationId }) => {
//       socket.join(conversationId);
//       console.log(`User ${socket.id} joined conversation ${conversationId}`);
//     });
    
//     // Leave a specific conversation room
//     socket.on('leaveRoom', ({ conversationId }) => {
//       socket.leave(conversationId);
//       console.log(`User ${socket.id} left conversation ${conversationId}`);
//     });
    
//     socket.on('sendMessage', async ({ conversationId, senderId, text }) => {
//       try {
//         const conversation = await Conversation.findById(conversationId);

//         if (!conversation) {
//           return socket.emit('errorMessage', 'Conversation not found.');
//         }

//         // Check if chat is active
//         if (!conversation.isActive) {
//           return socket.emit('errorMessage', 'This project is completed. Messaging is disabled.');
//         }

//         // Check if sender is a participant
//         const isParticipant = conversation.participants.some(
//           (participantId) => participantId.toString() === senderId
//         );

//         if (!isParticipant) {
//           return socket.emit('errorMessage', 'You are not authorized to send messages in this conversation.');
//         }

//         // Create and emit message
//         const message = await Message.create({
//           conversationId,
//           senderId,
//           text,
//         });

//         io.to(conversationId).emit('receiveMessage', message);
//       } catch (error) {
//         console.error('Send message error:', error.message);
//         socket.emit('errorMessage', 'Something went wrong while sending the message.');
//       }
//     });
    
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// };

// module.exports = socketHandler;