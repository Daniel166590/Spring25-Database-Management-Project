const express = require('express');
const router = express.Router();
const db = require('./db');

// GET suppliers by part number
// routes.js
const albumsRouter = require('./routes/albums');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const playlistRouter = require('./routes/playlist');

module.exports = function(app) {
  app.use('/api/albums', albumsRouter);
  app.use('/api/search', searchRouter); // Mount the search route
  app.use('/api/auth', authRouter);
  app.use('/api/playlist', playlistRouter);

  // You can add other routes here later
};