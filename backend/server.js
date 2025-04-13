const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors({
    origin: 'http://localhost:3000'
  }));

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};
  
app.use(cors(corsOptions));


// MySQL database connection
// Replace your existing MySQL connection code with:
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', // If you have a password, add it here
    database: 'CSCI4560_HW3',
    port: 3307,
    connectTimeout: 5000, // Timeout after 5 seconds
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('❌ MySQL connection failed:', err.message);
      process.exit(1); // Exit the process if MySQL is unreachable
    }
    console.log('✅ Connected to MySQL');
  });

// First middleware in server.js
app.use((req, res, next) => {
  console.log(`🌐 Incoming ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next(); // Call the next middleware/route handler
  });
  
  // Middleware to parse JSON
  app.use(express.json());
  
  // Route to get all suppliers
  app.get('/api/suppliers', (req, res) => {
    const query = 'SELECT * FROM SUPPLIER';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Database error' }); // Send a response
      }
      res.json(results);
    });
  });

app.get('/api/health', (req, res) => {
  console.log('✅ Health check endpoint hit'); // Add this line
  res.json({ status: 'Backend is running' });
});

// Add after existing routes but before app.listen()

// Insert Shipment
app.post('/api/insert-shipment', (req, res) => {
    const { sid, pid, quantity, cost } = req.body;
    const query = 'INSERT INTO SHIPMENT (Sno, Pno, Qty, Price) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [sid, pid, quantity, cost], (err, results) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ 
          message: 'Insert failed: ' + err.message,
          success: false
        });
      }
  
      // Return updated shipment table
      connection.query('SELECT * FROM SHIPMENT', (err, shipments) => {
        if (err) return res.status(500).json({ message: 'Fetch failed', success: false });
        res.json({ 
          message: 'Insert successful', 
          success: true,
          shipments 
        });
      });
    });
  });
  
  // Update Supplier Status
  app.put('/api/update-status', (req, res) => {
    connection.beginTransaction(err => {
      if (err) return res.status(500).json({ success: false, message: 'Update failed' });
  
      // Update status
      connection.query('UPDATE SUPPLIER SET Status = Status * 1.1', (errUpdate) => {
        if (errUpdate) {
          connection.rollback();
          return res.status(500).json({ success: false, message: 'Update failed' });
        }
  
        // Fetch updated suppliers
        connection.query('SELECT * FROM SUPPLIER', (errSelect, suppliers) => {
          if (errSelect) {
            connection.rollback();
            return res.status(500).json({ success: false, message: 'Fetch failed' });
          }
  
          connection.commit(errCommit => {
            if (errCommit) {
              connection.rollback();
              return res.status(500).json({ success: false, message: 'Update failed' });
            }
            res.json({ 
              success: true, 
              message: 'Status updated successfully', 
              suppliers 
            });
          });
        });
      });
    });
  });
  
  // Search Suppliers by Part (SQL Injection Safe)
  app.get('/suppliers/:partNumber', (req, res) => {
    const partNumber = req.params.partNumber;
    const query = `
      SELECT SUPPLIER.*, SHIPMENT.Qty, SHIPMENT.Price 
      FROM SUPPLIER
      JOIN SHIPMENT ON SUPPLIER.Sno = SHIPMENT.Sno
      WHERE SHIPMENT.Pno = ?
    `;
  
    connection.query(query, [partNumber], (err, results) => {
      if (err) {
        console.error('Search error:', err);
        return res.status(500).json([]);
      }
      res.json(results);
    });
  });

  app.post('/api/reset-database', (req, res) => {
    console.log('🔁 Reset database request received');
    
    try {
      const filePath = path.resolve(__dirname, 'reset.sql');
      console.log(`📂 Reading SQL file from: ${filePath}`);
      
      const resetSQL = fs.readFileSync(filePath, 'utf-8');
      console.log('📜 SQL file content:', resetSQL);
  
      const initSQL = `
        SET FOREIGN_KEY_CHECKS = 0;
        ${resetSQL}
        SET FOREIGN_KEY_CHECKS = 1;
      `;
  
      const queries = initSQL.split(';')
        .filter(q => q.trim())
        .map(q => q.trim());
  
      console.log(`🔍 Found ${queries.length} queries to execute:`);
      queries.forEach((q, i) => console.log(`  ${i + 1}. ${q.substring(0, 50)}...`));
  
      connection.beginTransaction(err => {
        if (err) {
          console.error('❌ Transaction start failed:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Transaction failed to start' 
          });
        }
  
        const executeNext = (index) => {
          if (index >= queries.length) {
            console.log('✅ All queries executed, committing transaction');
            connection.commit(err => {
              if (err) {
                console.error('❌ Commit error:', err);
                return connection.rollback(() => {
                  res.status(500).json({ 
                    success: false, 
                    message: 'Commit failed' 
                  });
                });
              }
              console.log('💾 Transaction committed successfully');
              res.json({ success: true, message: 'Database reset completed' });
            });
            return;
          }
  
          const currentQuery = queries[index];
          console.log(`⚡ Executing query ${index + 1}: ${currentQuery.substring(0, 100)}...`);
          
          connection.query(currentQuery, (err, results) => {
            if (err) {
              console.error(`❌ Query ${index + 1} failed:`, err);
              console.error('💥 Failed query:', currentQuery);
              return connection.rollback(() => {
                res.status(500).json({ 
                  success: false, 
                  message: `Query ${index + 1} failed`,
                  error: err.message
                });
              });
            }
            
            console.log(`✅ Query ${index + 1} succeeded. Results:`, results);
            executeNext(index + 1);
          });
        };
  
        executeNext(0);
      });
    } catch (err) {
      console.error('❌ Critical error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'File read failed',
        error: err.message 
      });
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 3005;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });