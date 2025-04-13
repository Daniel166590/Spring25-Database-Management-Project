const express = require('express');
const router = express.Router();
const db = require('./db');

// GET suppliers by part number
router.get('/suppliers/:partNumber', (req, res) => {
  const partNumber = req.params.partNumber;

  const query = `
    SELECT SUPPLIER.Sno, Sname, Status, City, SHIPMENT.Qty, SHIPMENT.Price
    FROM SUPPLIER
    JOIN SHIPMENT ON SUPPLIER.Sno = SHIPMENT.Sno
    WHERE SHIPMENT.Pno = ?
  `;

  db.query(query, [partNumber], (err, results) => {
    if (err) {
      console.error('Error fetching suppliers by part number:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

module.exports = router;