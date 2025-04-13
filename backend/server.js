// server.js
const express = require('express');
const cors = require('cors');
const setupRoutes = require('./routes');

const app = express();
const PORT = 3005;

// Cors configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware to parse JSON requests
app.use(express.json());

// Simple middleware to log incoming requests (optional but useful)
app.use((req, res, next) => {
  console.log(`🌐 [${req.method}] ${req.url}`);
  next();
});

// Setup all routes
setupRoutes(app);

// Root route (for quick testing)
app.get('/', (req, res) => {
  res.send('🎵 Music Database Backend Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});