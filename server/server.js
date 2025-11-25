require('dotenv').config({ path: './config/.env' });

const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db.js');
const ioService = require('./services/io');
const { initializeSocket } = require('./socket');

const courseAIRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/routes');
const authRoutes = require('./routes/routes');
const proposalRoutes = require('./routes/ProposalRoutes');
const aiProjectRoutes = require('./routes/aiProjectRoutes');
const aiProposalRoutes = require('./routes/aiProposalRoutes');
// const messagingRoutes = require('./controller/messaging');

const quizAIRoutes = require('./routes/QuizAiRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Create http server and attach socket.io
const server = http.createServer(app);

// Initialize Socket.IO with all configurations and handlers
const io = initializeSocket(server);

// Make io instance available to other modules
ioService.init(io);

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
app.use('/api/ai-proposal', aiProposalRoutes);
app.use('/api/proposals', proposalRoutes);
// messages
app.use('/api/messages', require('./routes/messageRoutes'));
// payments
app.use('/api/payments', require('./routes/paymentRoutes'));
// contracts
app.use('/api/contracts', require('./routes/contractRoutes'));
// paypal
app.use('/api/paypal', require('./routes/paypalRoutes'));
// app.use('/api/messaging', messagingRoutes);


// api routes for quiz
app.use('/api/ai-quiz', quizAIRoutes);

// Profile routes
app.use('/api/profile', require('./routes/Profile'));


// Start the server (use http server so socket.io works)
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
