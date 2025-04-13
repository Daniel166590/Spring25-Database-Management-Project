const express = require('express');
const mysql = require('mysql2');
const app = express();

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
  port: 3307 // Adjust this if needed
});

// Middleware
app.use(express.json());

// Route to get all suppliers
app.get('/api/suppliers', (req, res) => {
  connection.query('SELECT * FROM SUPPLIER', (err, results) => {
    if (err) {
      console.error('Error fetching suppliers:', err);
      return res.status(500).send('Error fetching suppliers');
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});