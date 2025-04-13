const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '', // Adjust if your MySQL password isn't empty
  database: 'Spring25_Database_Management_Project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection by running a simple query
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('✅ MySQL connection successful!');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
  }
})();

module.exports = pool;