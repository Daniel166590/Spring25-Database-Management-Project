// routes/search.js
const express = require('express');
const router = express.Router();
const { searchAlbums } = require('../queryFunctions'); // adjust the path if necessary

router.get('/', async (req, res) => {
  const searchTerm = req.query.q || "";    // the term from the search bar
  const limit = parseInt(req.query.limit, 10) || 100;
  const offset = parseInt(req.query.offset, 10) || 0;

  try {
    const results = await searchAlbums(searchTerm, limit, offset);
    res.json(results);
  } catch (err) {
    console.error("Error in searchAlbums API:", err);
    res.status(500).json({ error: "Failed to fetch search results." });
  }
});

module.exports = router;