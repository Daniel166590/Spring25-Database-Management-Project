// routes/albums.js
const express = require('express');
const router = express.Router();
const { getAlbumsWithSongs } = require('../queryFunctions');

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const albums = await getAlbumsWithSongs(limit, offset);
    res.json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch albums." });
  }
});

module.exports = router;