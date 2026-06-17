const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config/config');
const db = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contact');
const chatRoutes = require('./routes/chat');

const app = express();


// Apply security headers
app.use(helmet());

// Configure CORS dynamically
app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  const host = req.header('Host');
  
  let isAllowed = false;
  
  if (!origin) {
    // Allow requests with no origin (like mobile apps or curl requests)
    isAllowed = true;
  } else if (
    origin === `https://${host}` || 
    origin === `http://${host}` || 
    config.ALLOWED_ORIGINS.indexOf(origin) !== -1 || 
    config.NODE_ENV === 'development'
  ) {
    isAllowed = true;
  }
  
  if (isAllowed) {
    callback(null, { origin: true, credentials: true });
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}));

// Body parsers
app.use(express.json());

// Public health check route
app.get('/api/v1/health', async (req, res) => {
  try {
    // Check database connectivity
    await db.query('SELECT 1');
    return res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      database: 'connected'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Server or database is unhealthy',
      database: err.message
    });
  }
});
// Middleware to rewrite Netlify function path to standard API path
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api');
  }
  next();
});

// Register routes
app.use('/api/v1', menuRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/chat', chatRoutes);

// Wildcard 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API route not found',
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'An internal server error occurred',
    code: err.code || 'INTERNAL_SERVER_ERROR'
  });
});

module.exports = app;

