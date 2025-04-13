const express = require('express');
const router = express.Router();
const db = require('./db');

// GET suppliers by part number
// routes.js
const albumsRouter = require('./routes/albums');

module.exports = function(app) {
  app.use('/api/albums', albumsRouter);

  // You can add other routes here later
};