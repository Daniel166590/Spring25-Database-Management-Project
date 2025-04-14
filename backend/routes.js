const express = require('express');
const router = express.Router();
const db = require('./db');

// GET suppliers by part number
// routes.js
const albumsRouter = require('./routes/albums');
const searchRouter = require('./routes/search');

module.exports = function(app) {
  app.use('/api/albums', albumsRouter);
  app.use('/api/search', searchRouter); // Mount the search route

  // You can add other routes here later
};