// backend/routes/shipmentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // ← Your DB connection module (if any)

// Insert shipment
router.post('/insert-shipment', async (req, res) => {
  const { sid, pid, quantity, cost } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO SHIPMENT (sid, pid, quantity, cost) VALUES (?, ?, ?, ?)',
      [sid, pid, quantity, cost]
    );
    res.json({ success: true, message: 'Inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Insert failed' });
  }
});

module.exports = router;