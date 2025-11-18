require('dotenv').config({ path: './config/.env' });

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db.js');
const ioService = require('./services/io');
const User = require('./model/User');
const MessageModel = require('./model/Message');
const { verifyProposalParticipant } = require('./services/proposalAccess');

const courseAIRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/routes');
const authRoutes = require('./routes/routes');
const proposalRoutes = require('./routes/ProposalRoutes');
const aiProjectRoutes = require('./routes/aiProjectRoutes');
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

// socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization || '').replace('Bearer ', '');

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id email username');
    if (!user) {
      return next(new Error('Unauthorized'));
    }

    socket.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username || user.email,
    };
    next();
  } catch (err) {
    console.error('Socket authentication failed', err);
    next(new Error('Unauthorized'));
  }
});

const buildChatPayload = (doc, username, userId) => ({
  _id: doc._id,
  proposalId: doc.proposalId,
  message: doc.message,
  sender: { id: userId, name: username },
  attachments: doc.attachments || [],
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// basic socket handlers
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinRoom', async ({ room }) => {
    if (!room) return;
    if (room.startsWith('proposal_')) {
      const proposalId = room.replace('proposal_', '');
      const access = await verifyProposalParticipant(proposalId, socket.user.id);
      if (!access.allowed) {
        socket.emit('chatError', { message: access.error || 'Access denied.' });
        return;
      }
    }
    socket.join(room);
  });

  socket.on('leaveRoom', ({ room }) => {
    if (room) socket.leave(room);
  });

  socket.on('chatMessage', async ({ room, message }) => {
    if (!room || !message || !room.startsWith('proposal_')) return;

    const proposalId = room.replace('proposal_', '');
    const text = (message || '').trim();
    if (!text) return;

    const access = await verifyProposalParticipant(proposalId, socket.user.id);
    if (!access.allowed) {
      socket.emit('chatError', { message: access.error || 'Access denied.' });
      return;
    }

    try {
      const doc = await MessageModel.create({
        proposalId,
        senderId: socket.user.id,
        senderName: socket.user.username,
        message: text,
      });
      const payload = buildChatPayload(doc, socket.user.username, socket.user.id);
      io.to(room).emit('chatMessage', payload);
    } catch (err) {
      console.error('Failed to persist chat message', err);
      socket.emit('chatError', { message: 'Failed to send message.' });
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
app.use('/api/ai-project', aiProjectRoutes);
app.use('/api/proposals', proposalRoutes);
// messages
app.use('/api/messages', require('./routes/messageRoutes'));
// payments
app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/messaging', messagingRoutes);


// api routes for quiz
app.use('/api/ai-quiz', quizAIRoutes);

// Profile routes
app.use('/api/profile', require('./routes/Profile'));


// Start the server (use http server so socket.io works)
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
