const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserByUsername
} = require('../queryFunctions');

// POST /api/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // just store plaintext for now
    const userId = await createUser(username, email, password);
    res.json({ userId });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user || user.Password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // return the userId so front‑end can keep it
    res.json({ userId: user.UserID, username: user.Username });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;