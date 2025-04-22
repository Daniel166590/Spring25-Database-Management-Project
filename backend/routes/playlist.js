const express = require('express');
const router = express.Router();
const {
  getUserPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist
} = require('../queryFunctions');

// GET /api/playlist?userId=…
router.get('/', async (req, res) => {
  const userId = parseInt(req.query.userId, 10);
  try {
    const playlists = await getUserPlaylistSongs(userId);
    // since each user has exactly one playlist, grab playlists[0].songIds
    res.json(playlists[0]?.songIds || []);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/playlist/add
router.post('/add', async (req, res) => {
  const { playlistId, songId } = req.body;
  try {
    await addSongToPlaylist(playlistId, songId);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/playlist/remove
router.post('/remove', async (req, res) => {
  const { playlistId, songId } = req.body;
  try {
    await removeSongFromPlaylist(playlistId, songId);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;