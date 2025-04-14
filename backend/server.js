// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const setupRoutes = require('./routes'); // Your existing routes
const passport = require('./auth'); // Our standalone auth configuration (auth.js)

const app = express();
const PORT = 3005;

// Cors configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Express-session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Set this in your .env file
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Simple middleware to log incoming requests (optional but useful)
app.use((req, res, next) => {
  console.log(`🌐 [${req.method}] ${req.url}`);
  next();
});

// -------------------------
// Authentication Routes
// -------------------------

// Initiate authentication with Azure AD
app.get('/auth/azuread', passport.authenticate('azuread-openidconnect'));

// Callback route that Azure AD will post to after authentication
app.post(
  '/auth/azuread/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/auth/azuread/failure' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard (or desired route)
    res.redirect('/dashboard');
  }
);

// Failure route for authentication errors
app.get('/auth/azuread/failure', (req, res) => {
  res.send('Azure AD Authentication Failed');
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Middleware to protect routes (example)
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// Example protected dashboard route
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`
    <h1>Dashboard</h1>
    <p>Hello, ${req.user.displayName || req.user.name}</p>
    <p><a href="/logout">Log out</a></p>
  `);
});

// -------------------------
// Setup Additional API Routes
// -------------------------
setupRoutes(app);

// Root route (for quick testing)
app.get('/', (req, res) => {
  res.send('🎵 Music Database Backend Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});