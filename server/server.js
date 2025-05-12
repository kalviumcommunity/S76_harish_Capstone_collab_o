require('dotenv').config({ path: './config/.env' });

const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const courseAIRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/routes');
const authRoutes = require('./routes/routes');
const proposalRoutes = require('./routes/ProposalRoutes');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust the origin to match your frontend URL
  credentials: true,
}));
app.use(express.json());

// Database connection
connectDB();

// Socket handling
socketHandler(io);

// API routes
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);
app.use('/api/ai-course', courseAIRoutes);
app.use('/api/proposals', proposalRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});