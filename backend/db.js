const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'CSCI4560_HW3',
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('MySQL connected.');
  }
});

module.exports = db;