require('dotenv').config({ path: './config/.env' });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const courseAIRoutes = require('./routes/courseRoutes');
const projectRoutes = require('./routes/routes');
const authRoutes = require('./routes/routes');
const proposalRoutes = require('./routes/ProposalRoutes');
// const messagingRoutes = require('./controller/messaging');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://freecoll.netlify.app'],
  credentials: true
}));
app.use(express.json());

// Database connection
connectDB();

// API routes
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);
app.use('/api/ai-course', courseAIRoutes);
app.use('/api/proposals', proposalRoutes);
// app.use('/api/messaging', messagingRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});