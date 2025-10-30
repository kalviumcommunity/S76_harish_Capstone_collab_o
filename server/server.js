require('dotenv').config({ path: './config/.env' });

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db.js');
const ioService = require('./services/io');

const courseAIRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/routes');
const authRoutes = require('./routes/routes');
const proposalRoutes = require('./routes/ProposalRoutes');
// const messagingRoutes = require('./controller/messaging');

const quizAIRoutes = require('./routes/QuizAiRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Create http server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://freecoll.netlify.app'],
    methods: ['GET', 'POST']
  }
});

// initialize io service so other modules can access io
ioService.init(io);

// basic socket handlers
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinRoom', ({ room }) => {
    if (room) socket.join(room);
  });

  socket.on('leaveRoom', ({ room }) => {
    if (room) socket.leave(room);
  });

  socket.on('chatMessage', async ({ room, message, sender }) => {
    if (room) {
      // persist message to DB then emit to other members of the room
      try {
        const MessageModel = require('./model/Message');
        const proposalId = room.startsWith('proposal_') ? room.replace('proposal_', '') : null;
        let createdAt = new Date();
        if (proposalId) {
          const doc = await MessageModel.create({ proposalId, senderId: sender?.id, senderName: sender?.name, message });
          createdAt = doc.createdAt;
        }
        socket.to(room).emit('chatMessage', { message, sender, createdAt });
      } catch (err) {
        console.error('Failed to persist chat message', err);
      }
    }
  });

  socket.on('disconnect', () => {
    // console.log('Socket disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://freecoll.netlify.app'],
  credentials: true
}));
app.use(express.json());

// serve uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
connectDB();

// API routes
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);
app.use('/api/ai-course', courseAIRoutes);
app.use('/api/proposals', proposalRoutes);
// messages
app.use('/api/messages', require('./routes/messageRoutes'));
// app.use('/api/messaging', messagingRoutes);


// api routes for quiz
app.use('/api/ai-quiz', quizAIRoutes);

// Profile routes
app.use('/api/profile', require('./routes/Profile'));


// Start the server (use http server so socket.io works)
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});